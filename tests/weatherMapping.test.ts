import { describe, expect, it } from "vitest";
import { COPY } from "../src/config/copy";
import { evaluateTodayAdvice } from "../src/lib/rulesEngine";
import { WeatherData } from "../src/types/weather";

const FORBIDDEN_METEOROLOGICAL_TERMS = [
  "uv index",
  "precipitation probability",
  "apparent temperature",
  "dew point",
  "barometric",
  "origin",
  "destination",
  "differential",
  "layering",
  "el niño",
  "enso",
];

function getAllStrings(obj: unknown): string[] {
  if (typeof obj === "string") return [obj];
  if (typeof obj === "function") {
    // If it's a template function (e.g., feelsLike, tempDiffCooler), invoke with mock values
    try {
      const res = (obj as any)("Jos", 10);
      if (typeof res === "string") return [res];
    } catch {
      return [];
    }
  }
  if (typeof obj === "object" && obj !== null) {
    return Object.values(obj).flatMap((val) => getAllStrings(val));
  }
  return [];
}

describe("Asooo Copywriting Rules — Plain-English Enforcement", () => {
  it("ensures copy dictionary contains zero raw meteorological or technical jargon", () => {
    // Check all user-facing strings except the optional seasonal tip where El Niño is allowed as a seasonal note
    const { seasonalTip, ...mainCopy } = COPY;
    const allUserStrings = getAllStrings(mainCopy).join(" ").toLowerCase();

    FORBIDDEN_METEOROLOGICAL_TERMS.forEach((term) => {
      expect(allUserStrings).not.toContain(term);
    });
  });

  it("verifies advice output headlines and descriptions are strictly plain English", () => {
    const mockWeather: WeatherData = {
      location: { name: "Ikeja", state: "Lagos", country: "Nigeria", latitude: 6.6, longitude: 3.35 },
      fetchedAt: new Date().toISOString(),
      current: {
        temp: 32,
        feelsLike: 36,
        humidity: 80,
        rainChance: 60,
        uvIndex: 9,
        weatherCode: 61,
        windSpeed: 12,
        isHarmattan: false,
        isRaining: true,
        isSunStrong: true,
      },
      hourly: [],
    };

    const advice = evaluateTodayAdvice(mockWeather, "inside_ac");
    const serializedAdvice = JSON.stringify(advice).toLowerCase();

    FORBIDDEN_METEOROLOGICAL_TERMS.forEach((term) => {
      expect(serializedAdvice).not.toContain(term);
    });
  });
});
