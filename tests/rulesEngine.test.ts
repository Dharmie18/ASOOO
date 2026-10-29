import { describe, expect, it } from "vitest";
import { evaluateTodayAdvice, evaluateTripAdvice } from "../src/lib/rulesEngine";
import { WeatherData } from "../src/types/weather";

function createMockWeather(overrides: Partial<WeatherData["current"]>, locationName = "Lagos"): WeatherData {
  const current = {
    temp: 31,
    feelsLike: 35,
    humidity: 75,
    rainChance: 10,
    uvIndex: 6,
    weatherCode: 1,
    windSpeed: 10,
    isHarmattan: false,
    isRaining: false,
    isSunStrong: false,
    ...overrides,
  };

  const hourly = Array.from({ length: 24 }).map((_, hour) => ({
    time: `2026-10-29T${String(hour).padStart(2, "0")}:00`,
    hour,
    temp: current.temp,
    feelsLike: current.feelsLike,
    humidity: current.humidity,
    rainChance: current.rainChance,
    precipitation: 0,
    uvIndex: current.uvIndex,
    weatherCode: current.weatherCode,
    windSpeed: current.windSpeed,
  }));

  return {
    location: {
      name: locationName,
      state: "Lagos",
      country: "Nigeria",
      latitude: 6.5244,
      longitude: 3.3792,
    },
    fetchedAt: "2026-10-29T10:00:00Z",
    current,
    hourly,
  };
}

describe("Asooo Rules Engine — Today Advice", () => {
  it("recommends light breathable cotton and shade for extreme heat", () => {
    const weather = createMockWeather({
      temp: 34,
      feelsLike: 39,
      uvIndex: 9,
      isSunStrong: true,
    });

    const advice = evaluateTodayAdvice(weather, "outside");
    expect(advice.headline).toContain("Very hot and sunny");
    expect(advice.alert?.type).toBe("sun");
    expect(advice.essentials.some((item) => item.label.toLowerCase().includes("cotton") || item.label.toLowerCase().includes("polo"))).toBe(true);
    // Never mention El Niño in daily advice
    expect(advice.headline.toLowerCase()).not.toContain("el niño");
    expect(advice.headline.toLowerCase()).not.toContain("enso");
  });

  it("adds AC layering advice when user selects inside_ac in hot weather", () => {
    const weather = createMockWeather({
      temp: 33,
      feelsLike: 37,
    });

    const advice = evaluateTodayAdvice(weather, "inside_ac");
    expect(advice.headline.toLowerCase()).toContain("cardigan");
    expect(advice.placeTypeAdvice.toLowerCase()).toContain("cold");
    expect(advice.essentials.some((item) => item.category === "layer")).toBe(true);
  });

  it("triggers rain alert and recommends umbrella when rain chance is high", () => {
    const weather = createMockWeather({
      rainChance: 85,
      isRaining: true,
    });

    const advice = evaluateTodayAdvice(weather, "both");
    expect(advice.alert?.type).toBe("rain");
    expect(advice.alert?.action.toLowerCase()).toContain("umbrella");
    expect(advice.headline.toLowerCase()).toContain("rain");
    expect(advice.essentials.some((item) => item.label.toLowerCase().includes("umbrella"))).toBe(true);
  });

  it("handles Harmattan conditions with skin and dust protection advice", () => {
    const weather = createMockWeather({
      temp: 24,
      feelsLike: 23,
      humidity: 18, // Very low humidity
      isHarmattan: true,
    });

    const advice = evaluateTodayAdvice(weather, "outside");
    expect(advice.alert?.type).toBe("harmattan");
    expect(advice.headline.toLowerCase()).toContain("dusty");
    expect(advice.essentials.some((item) => item.label.toLowerCase().includes("lip balm"))).toBe(true);
  });
});

describe("Asooo Rules Engine — Trip Comparison ('Hot here, cold there')", () => {
  it("detects major drop from Lagos (33°C) to Jos (19°C) and advises jacket in hand luggage", () => {
    const lagosWeather = createMockWeather({ temp: 31, feelsLike: 34 }, "Lagos");
    const josWeather = createMockWeather({ temp: 19, feelsLike: 18, humidity: 40 }, "Jos");
    // Modify Jos hourly for 17:00 arrival
    josWeather.hourly[17] = {
      ...josWeather.hourly[17],
      temp: 18,
      feelsLike: 17,
    };

    const tripAdvice = evaluateTripAdvice(
      lagosWeather,
      8, // leaving at 8am
      josWeather,
      17, // arriving at 5pm
      "both"
    );

    expect(tripAdvice.isSignificantGap).toBe(true);
    expect(tripAdvice.tempDifference).toBeLessThanOrEqual(-7);
    expect(tripAdvice.headline.toLowerCase()).toContain("cooler in jos");
    expect(tripAdvice.headline.toLowerCase()).toContain("jacket");
    expect(tripAdvice.alert?.type).toBe("temp_gap");
    expect(tripAdvice.packingAdvice.some((tip) => tip.toLowerCase().includes("hand luggage"))).toBe(true);
  });

  it("handles short trips with minor temp gap (Ikeja to Victoria Island)", () => {
    const ikejaWeather = createMockWeather({ temp: 31, feelsLike: 34 }, "Ikeja");
    const viWeather = createMockWeather({ temp: 30, feelsLike: 33 }, "Victoria Island");

    const tripAdvice = evaluateTripAdvice(
      ikejaWeather,
      9,
      viWeather,
      11,
      "inside_ac"
    );

    expect(tripAdvice.isSignificantGap).toBe(false);
    expect(tripAdvice.isShortTrip).toBe(true);
    expect(tripAdvice.headline.toLowerCase()).toContain("about the same");
  });
});
