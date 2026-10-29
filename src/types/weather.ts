export interface HourlyPoint {
  time: string;           // ISO string (e.g. "2026-10-29T08:00")
  hour: number;           // 0 - 23
  temp: number;           // Celsius
  feelsLike: number;      // Celsius (Apparent temperature)
  humidity: number;       // Percentage (0 - 100)
  rainChance: number;     // Precipitation probability % (0 - 100)
  precipitation: number;  // mm
  uvIndex: number;        // UV index (0 - 12+)
  weatherCode: number;    // WMO weather interpretation code
  windSpeed: number;      // km/h
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  rainChance: number;
  uvIndex: number;
  weatherCode: number;
  windSpeed: number;
  isHarmattan: boolean;
  isRaining: boolean;
  isSunStrong: boolean;
}

export interface LocationInfo {
  name: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  location: LocationInfo;
  fetchedAt: string;
  current: CurrentWeather;
  hourly: HourlyPoint[];
}

export interface GeocodeResult {
  id: string | number;
  name: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
}
