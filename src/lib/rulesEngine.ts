import { COPY } from "../config/copy";
import { RULES_CONFIG } from "../config/rulesConfig";
import { CurrentWeather, HourlyPoint, WeatherData } from "../types/weather";
import {
  AdviceOutput,
  OutfitItem,
  PlaceType,
  SmartAlert,
  TripComparisonOutput,
} from "../types/rules";

/**
 * Evaluates outfit advice for the "Today" screen.
 */
export function evaluateTodayAdvice(
  weather: WeatherData,
  placeType: PlaceType = "both"
): AdviceOutput {
  const { current, hourly } = weather;
  const th = RULES_CONFIG.thresholds;

  // Check if upcoming hours (next 8 hours) have high rain probability
  const upcomingRain = hourly.slice(0, 8).find((h) => h.rainChance >= th.rainLikely);
  const rainChanceMax = Math.max(
    current.rainChance,
    ...hourly.slice(0, 8).map((h) => h.rainChance || 0)
  );

  const isHarmattan =
    current.humidity <= th.harmattanHumidity && current.temp <= 28;
  const isRainingNow = current.isRaining || current.rainChance >= th.rainLikely;
  const isRainComing = !isRainingNow && rainChanceMax >= th.rainLikely;
  const isExtremeHeat = current.feelsLike >= th.extremeHeat;
  const isHot = current.feelsLike >= th.hot;
  const isCool = current.feelsLike < th.mild && current.feelsLike >= th.cool;
  const isCold = current.feelsLike < th.cool;
  const isSunStrong = current.uvIndex >= th.strongSunUV;

  // Determine Primary Smart Alert (max 1 urgent plain action)
  let alert: SmartAlert | undefined;
  if (isRainingNow || isRainComing) {
    alert = {
      type: "rain",
      title: COPY.alerts.rain.title,
      action: COPY.alerts.rain.action,
    };
  } else if (isHarmattan) {
    alert = {
      type: "harmattan",
      title: COPY.alerts.harmattan.title,
      action: COPY.alerts.harmattan.action,
    };
  } else if (isSunStrong) {
    alert = {
      type: "sun",
      title: COPY.alerts.sun.title,
      action: COPY.alerts.sun.action,
    };
  }

  // Construct Big Plain-Language Headline & Supporting text
  let headline = "";
  let supporting = "";
  const feelsLikeText = COPY.temperature.feelsLike(current.feelsLike);

  if (isHarmattan) {
    headline = "Dry and dusty weather. Cover up comfortably and protect your skin.";
    supporting = `${feelsLikeText} • Very dry air • Cool early breeze`;
  } else if (isRainingNow) {
    headline = "Rainy today. Wear shoes that handle water and carry a strong umbrella.";
    supporting = `${feelsLikeText} • Rain likely • Wet roads and puddles`;
  } else if (isRainComing) {
    const rainTime = upcomingRain ? `after ${formatHour(upcomingRain.hour)}` : "later today";
    headline = `Warm and clear now, but rain is expected ${rainTime}. Carry a small umbrella.`;
    supporting = `${feelsLikeText} • Rain likely ${rainTime}`;
  } else if (isExtremeHeat) {
    if (placeType === "inside_ac") {
      headline = "Very hot outside, but cold inside. Dress light and keep a cardigan for the AC.";
    } else {
      headline = "Very hot and sunny. Wear loose, light cotton to stay cool.";
    }
    supporting = `${feelsLikeText} • Strong sun • Drink water often`;
  } else if (isHot) {
    if (placeType === "inside_ac") {
      headline = "Sunny outside. Keep a light layer handy for cold indoor air conditioning.";
    } else {
      headline = "Warm and sunny. Light cotton clothes are best for today.";
    }
    supporting = `${feelsLikeText} • Clear skies`;
  } else if (isCold || isCool) {
    headline = "Cool weather today. Wear long sleeves or a light jacket to stay warm.";
    supporting = `${feelsLikeText} • Pleasant breeze`;
  } else {
    headline = "Pleasant weather today. Regular everyday clothes will work fine.";
    supporting = `${feelsLikeText} • Calm skies`;
  }

  // Place Type Advice
  let placeTypeAdvice = "";
  if (placeType === "inside_ac") {
    placeTypeAdvice = COPY.placeType.adviceInsideAc;
  } else if (placeType === "both") {
    placeTypeAdvice = COPY.placeType.adviceBoth;
  } else {
    placeTypeAdvice = COPY.placeType.adviceOutside;
  }

  // Outfit Essentials (3 to 5 structured tags)
  const essentials: OutfitItem[] = [];

  // 1. Top
  if (isExtremeHeat || isHot) {
    essentials.push({
      category: "tops",
      label: "Short-sleeve shirt, polo, or light top",
      detail: "Loose fit to let air flow",
    });
  } else if (isHarmattan || isCold) {
    essentials.push({
      category: "tops",
      label: "Long-sleeve shirt or light kaftan",
      detail: "Shields skin from dry dust and cool breeze",
    });
  } else {
    essentials.push({
      category: "tops",
      label: "Everyday shirt, top, or t-shirt",
      detail: "Comfortable and easy to move in",
    });
  }

  // 2. Fabric
  if (isHarmattan) {
    essentials.push({
      category: "fabric",
      label: "Cotton, light denim, or linen",
      detail: "Fabrics that don't trap dust",
    });
  } else if (isExtremeHeat || isHot) {
    essentials.push({
      category: "fabric",
      label: "100% Cotton, light Ankara, or pure Linen",
      detail: "Breathable and keeps sweat away",
    });
  } else {
    essentials.push({
      category: "fabric",
      label: "Cotton or soft mixed weave",
      detail: "Gentle on skin",
    });
  }

  // 3. Recommended Colors
  if (isExtremeHeat || isHot) {
    essentials.push({
      category: "colors",
      label: "White, cream, sky blue, or light colors",
      detail: "Light shades reflect the hot sun",
    });
  } else if (isHarmattan) {
    essentials.push({
      category: "colors",
      label: "Earth tones, khaki, or navy",
      detail: "Colors that don't easily show red dust",
    });
  } else if (isRainingNow || isRainComing) {
    essentials.push({
      category: "colors",
      label: "Darker colors",
      detail: "Hides sudden rainwater or muddy splashes",
    });
  } else {
    essentials.push({
      category: "colors",
      label: "Any color you love",
      detail: "All colors fit the mild weather",
    });
  }

  // 4. Layer (Based on AC / Cold / Harmattan)
  const needsLayer =
    placeType !== "outside" || isCold || isCool || isHarmattan;
  if (needsLayer) {
    let layerLabel = "Light cardigan, shawl, or jacket";
    let layerDetail = "To slip on when the indoor AC feels too cold";
    if (isHarmattan || isCold) {
      layerLabel = "Sweater or light jacket";
      layerDetail = "For the early morning and late evening chill";
    }
    essentials.push({
      category: "layer",
      label: layerLabel,
      detail: layerDetail,
      isLayer: true,
    });
  }

  // 5. Accessories
  const accs: string[] = [];
  if (isRainingNow || isRainComing) accs.push("Sturdy umbrella");
  if (isSunStrong) accs.push("Face cap or dark sunglasses");
  if (isHarmattan) accs.push("Lip balm and pocket lotion");
  if (accs.length === 0) accs.push("Water bottle");

  essentials.push({
    category: "accessories",
    label: accs.join(" • "),
    detail: "Handy items to carry today",
  });

  return {
    headline,
    supporting,
    temperatureSummary: feelsLikeText,
    placeType,
    placeTypeAdvice,
    alert,
    essentials: essentials.slice(0, 5),
  };
}

/**
 * Evaluates trip advice comparing departure time weather at origin
 * with arrival time weather at destination ("Hot here, cold there").
 */
export function evaluateTripAdvice(
  originWeather: WeatherData,
  departureHour: number,
  destinationWeather: WeatherData,
  arrivalHour: number,
  placeType: PlaceType = "both"
): TripComparisonOutput {
  const th = RULES_CONFIG.thresholds;

  // Extract hourly slices
  const originSlice =
    originWeather.hourly.find((h) => h.hour === departureHour) ||
    originWeather.hourly[0] ||
    currentToHourlyPoint(originWeather.current, departureHour);

  const destSlice =
    destinationWeather.hourly.find((h) => h.hour === arrivalHour) ||
    destinationWeather.hourly[0] ||
    currentToHourlyPoint(destinationWeather.current, arrivalHour);

  const deltaFeelsLike = destSlice.feelsLike - originSlice.feelsLike;
  const isDrop = deltaFeelsLike <= -th.tempGapNoticeable;
  const isMajorDrop = deltaFeelsLike <= -th.tempGapMajor;
  const isRise = deltaFeelsLike >= th.tempGapNoticeable;
  const isMajorRise = deltaFeelsLike >= th.tempGapMajor;
  const isShortTrip =
    Math.abs(deltaFeelsLike) < th.tempGapNoticeable &&
    destinationWeather.location.state === originWeather.location.state;

  const originPlace = originWeather.location.name;
  const destPlace = destinationWeather.location.name;

  // Evaluate conditions
  const destRaining = destSlice.rainChance >= th.rainLikely;
  const originRaining = originSlice.rainChance >= th.rainLikely;
  const destHarmattan = destSlice.humidity <= th.harmattanHumidity && destSlice.temp <= 28;

  let headline = "";
  let alert: SmartAlert | undefined;
  const packingAdvice: string[] = [];

  if (isMajorDrop || isDrop) {
    const diffDegrees = Math.abs(Math.round(deltaFeelsLike));
    headline = `It's ${Math.round(originSlice.feelsLike)}° in ${originPlace}, but it will feel like ${Math.round(destSlice.feelsLike)}° in ${destPlace} on arrival (${diffDegrees}° cooler in ${destPlace}). Bring a jacket or warm layer.`;
    alert = {
      type: "temp_gap",
      title: COPY.alerts.tempGap.title,
      action: COPY.alerts.tempGap.action,
    };
    packingAdvice.push(`Keep a sweater or jacket inside your hand luggage so you can put it on as soon as you arrive in ${destPlace}.`);
  } else if (isMajorRise || isRise) {
    const diffDegrees = Math.round(deltaFeelsLike);
    headline = `It's ${Math.round(originSlice.feelsLike)}° in ${originPlace}, but it will feel like ${Math.round(destSlice.feelsLike)}° in ${destPlace} (${diffDegrees}° warmer). Wear a light base layer.`;
    packingAdvice.push(`Wear light, breathable cotton so you don't overheat when you get to ${destPlace}.`);
  } else if (destRaining) {
    headline = `The temperature in ${destPlace} is similar to here, but rain is expected at your arrival time. Bring an umbrella.`;
    alert = {
      type: "rain",
      title: COPY.alerts.rain.title,
      action: `Keep an umbrella inside your personal bag for when you arrive in ${destPlace}.`,
    };
    packingAdvice.push("Pack an umbrella in an easy-to-reach spot.");
  } else if (isShortTrip) {
    headline = `The weather in ${destPlace} is about the same as where you are (${Math.round(destSlice.feelsLike)}°). Dress for your normal day.`;
    packingAdvice.push(COPY.trip.shortTripNote);
  } else {
    headline = `Weather in ${destPlace} is pleasant and similar to ${originPlace} (${Math.round(destSlice.feelsLike)}°). Your standard outfit works great.`;
  }

  // AC layer advice for trip
  if (placeType !== "outside") {
    packingAdvice.push("If travelling in an air-conditioned car, bus, or plane, keep a light shawl or sweater handy.");
  }

  if (destHarmattan) {
    packingAdvice.push(`Air in ${destPlace} is dry and dusty. Take lip balm and lotion in your pocket.`);
  }

  // Recommended travel wear
  const recommendedWear: OutfitItem[] = [
    {
      category: "tops",
      label: "Breathable cotton base top",
      detail: "Comfortable for sitting through transit",
    },
    {
      category: "bottoms",
      label: "Comfortable trousers or chinos",
      detail: "Easy for movement and changing vehicles",
    },
    {
      category: "layer",
      label: isDrop || placeType !== "outside" ? "Warm jacket or cardigan (Carry-on)" : "Light optional shawl",
      detail: isDrop ? `Needed for the cooler arrival in ${destPlace}` : "Handy for bus or plane AC",
      isLayer: true,
    },
    {
      category: "accessories",
      label: destRaining || originRaining ? "Umbrella • Water bottle" : "Water bottle • Sunglasses",
      detail: "Transit essentials",
    },
  ];

  return {
    headline,
    originSummary: {
      place: originPlace,
      time: formatHour(departureHour),
      temperature: Math.round(originSlice.temp),
      feelsLike: Math.round(originSlice.feelsLike),
      condition: summarizeCondition(originSlice),
    },
    destinationSummary: {
      place: destPlace,
      time: formatHour(arrivalHour),
      temperature: Math.round(destSlice.temp),
      feelsLike: Math.round(destSlice.feelsLike),
      condition: summarizeCondition(destSlice),
    },
    tempDifference: Math.round(deltaFeelsLike),
    isSignificantGap: Math.abs(deltaFeelsLike) >= th.tempGapNoticeable,
    isShortTrip,
    alert,
    recommendedWear,
    packingAdvice,
  };
}

function summarizeCondition(point: HourlyPoint): string {
  if (point.rainChance >= 50) return "Rain likely";
  if (point.humidity <= 25 && point.temp <= 28) return "Dry & dusty";
  if (point.feelsLike >= 36) return "Very hot";
  if (point.feelsLike >= 30) return "Warm & sunny";
  if (point.feelsLike < 20) return "Cool breeze";
  return "Clear & pleasant";
}

function formatHour(hour: number): string {
  const h = hour % 24;
  if (h === 0) return "12am (Midnight)";
  if (h === 12) return "12pm (Noon)";
  if (h < 12) return `${h}am`;
  return `${h - 12}pm`;
}

function currentToHourlyPoint(current: CurrentWeather, targetHour: number): HourlyPoint {
  return {
    time: `Hour-${targetHour}`,
    hour: targetHour,
    temp: current.temp,
    feelsLike: current.feelsLike,
    humidity: current.humidity,
    rainChance: current.rainChance,
    precipitation: 0,
    uvIndex: current.uvIndex,
    weatherCode: current.weatherCode,
    windSpeed: current.windSpeed,
  };
}
