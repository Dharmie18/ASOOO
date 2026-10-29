/**
 * Asooo — Plain-English Copy Dictionary
 *
 * STRICT RULE: All user-facing strings live in this file.
 * No raw meteorological terms (UV index, precipitation probability, humidity %,
 * apparent temperature, origin/destination, differential) anywhere in user-facing UI.
 * Primary-school reading level (approachable for both a 12-year-old and a 65-year-old).
 */

export const COPY = {
  brand: {
    name: "Asooo",
    tagline: "Weather-aware outfit advice for your day and your trip",
    brandMeaning: "Aṣọ (Yoruba) — Clothes / What to wear",
  },

  navigation: {
    today: "Today",
    trip: "Trip",
    settings: "Settings",
  },

  onboarding: {
    title: "Check what to wear today",
    subtitle: "We only use your location to check your weather. We do not track you.",
    useLocationBtn: "Use my location",
    manualBtn: "Type your town",
    locating: "Checking your location...",
    locationGranted: "Found your town",
  },

  placeType: {
    title: "Where will you spend your day?",
    outside: "Outside",
    insideAc: "Mostly inside with AC",
    both: "Both inside & out",
    adviceOutside: "You will be out in the open. Dress in light clothes and drink plenty of water.",
    adviceInsideAc: "Offices, banks and churches can be very cold. Keep a light jacket, sweater, or cardigan handy.",
    adviceBoth: "It is warm outside but cold indoors. Wear light clothes with a layer you can easily take off.",
  },

  weatherTranslations: {
    sunVeryStrong: "The sun is very strong. Wear a cap or stay under shade.",
    sunModerate: "Sunny and warm outside.",
    sunMild: "Gentle sunshine today.",

    rainHeavy: "Heavy rain is falling or coming very soon. Wear water-friendly shoes and carry a strong umbrella.",
    rainLikely: "Rain is likely today. Carry an umbrella before you step out.",
    rainPossible: "Rain is possible later. Keeping a small folding umbrella is smart.",
    noRain: "No rain expected today.",

    humidityHigh: "The air is sticky and humid. Wear light clothes that breathe well.",
    humidityComfortable: "The air feels fresh and comfortable.",

    harmattanActive: "Dry and dusty Harmattan weather. Cover your nose outside, and use lip balm and body lotion.",
    harmattanModerate: "Dusty morning with dry air. A light layer will keep the early chill away.",

    chillyMorning: "Cool morning ahead. Start your day with a light jacket or long sleeves.",
    hotAfternoon: "Hot afternoon coming. Light colors will help reflect the heat.",
  },

  temperature: {
    feelsLike: (temp: number): string => `Feels like ${Math.round(temp)}°`,
    actualTemp: (temp: number): string => `${Math.round(temp)}°`,
    tempDiffCooler: (place: string, diff: number): string =>
      `It will be ${Math.round(diff)}° cooler in ${place}.`,
    tempDiffWarmer: (place: string, diff: number): string =>
      `It will be ${Math.round(diff)}° warmer in ${place}.`,
    tempDiffSame: (place: string): string =>
      `The temperature in ${place} is about the same as where you are.`,
  },

  trip: {
    title: "Trip Outfit Advice",
    tagline: "Hot here, cold there — pack and dress right for your journey.",
    departureLocationLabel: "Where you are",
    arrivalLocationLabel: "Where you're going",
    departureTimeLabel: "Leaving at",
    arrivalTimeLabel: "Arriving at",
    compareBtn: "Check travel outfit",
    arrivalTownPlaceholder: "Type town (e.g. Jos, Abuja, Ibadan, Kano)",
    shortTripNote: "Short trip: the temperature won't change much, but watch out for rain and indoor AC.",
    bigDropNote: "Noticeable drop in temperature on arrival. Keep a jacket or sweater in your hand luggage.",
    bigRiseNote: "It is noticeably warmer where you are arriving. Wear a light base layer so you can stay cool.",
  },

  alerts: {
    rain: {
      title: "Rain coming soon",
      action: "Grab an umbrella or shower cap before you leave home.",
    },
    sun: {
      title: "Very strong sun",
      action: "Wear sunglasses, a face cap, or stay under shade around midday.",
    },
    harmattan: {
      title: "Dry and dusty weather",
      action: "Protect your lips with balm and apply cream to avoid dry skin.",
    },
    tempGap: {
      title: "Big weather difference",
      action: "Keep a warm cardigan or jacket inside your hand bag, not your main luggage.",
    },
  },

  outfitCategories: {
    tops: "Top",
    bottoms: "Bottom",
    fabric: "Best fabric",
    colors: "Recommended colors",
    layer: "Layer to bring",
    accessories: "Helpful items",
  },

  shareCard: {
    buttonLabel: "Share to WhatsApp Status",
    modalTitle: "Today's Outfit Card",
    downloadBtn: "Save Image",
    watermark: "Checked on Asooo • Simple weather advice",
  },

  states: {
    offlineNote: (time: string): string =>
      `You are offline. Showing saved weather from ${time}.`,
    locationDenied:
      "Location permission is turned off. No problem — type your town above to check your outfit.",
    placeNotFound:
      "We could not find that town. Please check the spelling or choose a nearby major city.",
    networkError:
      "Could not reach the weather service. Check your internet connection.",
    retryBtn: "Try Again",
    loadingWeather: "Checking the skies...",
    loadingTrip: "Comparing both journeys...",
  },

  seasonalTip: {
    elNinoNotice:
      "Seasonal note: The coming months in Nigeria may be hotter and drier than usual. Drink plenty of water and seek shade.",
  },
} as const;

export type CopyDictionary = typeof COPY;
