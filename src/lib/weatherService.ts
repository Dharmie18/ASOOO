import { GeocodeResult, WeatherData } from "@/types/weather";

const STORAGE_LAST_WEATHER_KEY = "asooo_last_weather";
const STORAGE_LAST_LOCATION_KEY = "asooo_last_location";

export async function fetchLiveWeather(
  latitude: number,
  longitude: number,
  locationName = "Your Location",
  stateName = ""
): Promise<WeatherData> {
  const query = new URLSearchParams({
    lat: latitude.toString(),
    lon: longitude.toString(),
    name: locationName,
    state: stateName,
  });

  try {
    const res = await fetch(`/api/weather?${query.toString()}`);
    if (!res.ok) {
      throw new Error(`Weather fetch failed: ${res.status}`);
    }
    const data: WeatherData = await res.json();
    saveLastWeatherToStorage(data);
    return data;
  } catch (err) {
    const cached = getLastWeatherFromStorage();
    if (cached) return cached;
    throw err;
  }
}

export async function searchLocations(query: string): Promise<GeocodeResult[]> {
  const clean = query.trim();
  if (clean.length < 2) return [];

  try {
    const res = await fetch(`/api/geocode?q=${encodeURIComponent(clean)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch {
    return [];
  }
}

export function saveLastWeatherToStorage(data: WeatherData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_LAST_WEATHER_KEY, JSON.stringify(data));
    localStorage.setItem(
      STORAGE_LAST_LOCATION_KEY,
      JSON.stringify(data.location)
    );
  } catch {}
}

export function getLastWeatherFromStorage(): WeatherData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_LAST_WEATHER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
