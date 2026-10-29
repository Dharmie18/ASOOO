import { NextRequest, NextResponse } from "next/server";
import { CurrentWeather, HourlyPoint, WeatherData } from "@/types/weather";

interface CacheEntry {
  timestamp: number;
  data: WeatherData;
}

const CACHE_TTL_MS = 15 * 60 * 1000;
const weatherCache = new Map<string, CacheEntry>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get("lat");
  const lonStr = searchParams.get("lon");
  const name = searchParams.get("name") || "Your Location";
  const state = searchParams.get("state") || "";

  if (!latStr || !lonStr) {
    return NextResponse.json(
      { error: "Latitude and longitude are required parameters." },
      { status: 400 }
    );
  }

  const lat = parseFloat(latStr);
  const lon = parseFloat(lonStr);

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json(
      { error: "Invalid coordinate values provided." },
      { status: 400 }
    );
  }

  const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const cached = weatherCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data, {
      headers: { "X-Cache": "HIT" },
    });
  }

  const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,uv_index,wind_speed_10m&timezone=Africa%2FLagos&forecast_days=2`;

  try {
    const res = await fetch(endpoint, { next: { revalidate: 900 } });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Weather service error (${res.status}).` },
        { status: 502 }
      );
    }

    const raw = await res.json();
    const cur = raw.current;
    const hr = raw.hourly;

    if (
      !cur ||
      typeof cur.temperature_2m !== "number" ||
      typeof cur.apparent_temperature !== "number" ||
      typeof cur.relative_humidity_2m !== "number" ||
      !hr ||
      !Array.isArray(hr.time) ||
      hr.time.length === 0
    ) {
      return NextResponse.json(
        { error: "Incomplete weather forecast data received from provider." },
        { status: 502 }
      );
    }

    const currentHourIndex = Math.min(
      Math.max(0, new Date().getHours()),
      (hr.time.length || 1) - 1
    );

    const actualCurrentRainChance =
      typeof hr.precipitation_probability?.[currentHourIndex] === "number"
        ? hr.precipitation_probability[currentHourIndex]
        : (cur.precipitation || 0) > 0 ? 100 : 0;

    const actualCurrentUv =
      typeof hr.uv_index?.[currentHourIndex] === "number"
        ? hr.uv_index[currentHourIndex]
        : 0;

    const maxDayUv = Array.isArray(hr.uv_index)
      ? Math.max(...hr.uv_index.slice(0, 24).filter((v: unknown): v is number => typeof v === "number"))
      : 0;

    const current: CurrentWeather = {
      temp: cur.temperature_2m,
      feelsLike: cur.apparent_temperature,
      humidity: cur.relative_humidity_2m,
      rainChance: actualCurrentRainChance,
      uvIndex: actualCurrentUv,
      weatherCode: typeof cur.weather_code === "number" ? cur.weather_code : 0,
      windSpeed: typeof cur.wind_speed_10m === "number" ? cur.wind_speed_10m : 0,
      isHarmattan: cur.relative_humidity_2m <= 25 && cur.temperature_2m <= 28,
      isRaining:
        (cur.precipitation || 0) > 0.5 ||
        (cur.weather_code >= 51 && cur.weather_code <= 67),
      isSunStrong: maxDayUv >= 7.5 || actualCurrentUv >= 7.5,
    };

    const hourly: HourlyPoint[] = hr.time.slice(0, 24).map((timeStr: string, idx: number) => {
      const hour = new Date(timeStr).getHours();
      const tempVal = hr.temperature_2m?.[idx];
      const feelsLikeVal = hr.apparent_temperature?.[idx];
      const humidityVal = hr.relative_humidity_2m?.[idx];
      const rainChanceVal = hr.precipitation_probability?.[idx];

      return {
        time: timeStr,
        hour,
        temp: typeof tempVal === "number" ? tempVal : current.temp,
        feelsLike: typeof feelsLikeVal === "number" ? feelsLikeVal : current.feelsLike,
        humidity: typeof humidityVal === "number" ? humidityVal : current.humidity,
        rainChance: typeof rainChanceVal === "number" ? rainChanceVal : 0,
        precipitation: typeof hr.precipitation?.[idx] === "number" ? hr.precipitation[idx] : 0,
        uvIndex: typeof hr.uv_index?.[idx] === "number" ? hr.uv_index[idx] : 0,
        weatherCode: typeof hr.weather_code?.[idx] === "number" ? hr.weather_code[idx] : 0,
        windSpeed: typeof hr.wind_speed_10m?.[idx] === "number" ? hr.wind_speed_10m[idx] : 0,
      };
    });

    const payload: WeatherData = {
      location: {
        name,
        state,
        country: "Nigeria",
        latitude: lat,
        longitude: lon,
      },
      fetchedAt: new Date().toISOString(),
      current,
      hourly,
    };

    weatherCache.set(cacheKey, { timestamp: Date.now(), data: payload });

    return NextResponse.json(payload, {
      headers: { "X-Cache": "MISS" },
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach weather forecast provider." },
      { status: 502 }
    );
  }
}
