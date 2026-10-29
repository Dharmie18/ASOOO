export type PlaceType = "outside" | "inside_ac" | "both";

export type AlertType = "rain" | "sun" | "harmattan" | "temp_gap";

export interface SmartAlert {
  type: AlertType;
  title: string;
  action: string;
}

export interface OutfitItem {
  category: "tops" | "bottoms" | "fabric" | "colors" | "layer" | "accessories";
  label: string;
  detail: string;
  isLayer?: boolean;
}

export interface AdviceOutput {
  headline: string;
  supporting: string;
  temperatureSummary: string;
  placeType: PlaceType;
  placeTypeAdvice: string;
  alert?: SmartAlert;
  essentials: OutfitItem[];
  seasonalNotice?: string;
}

export interface TripComparisonOutput {
  headline: string;
  originSummary: {
    place: string;
    time: string;
    temperature: number;
    feelsLike: number;
    condition: string;
  };
  destinationSummary: {
    place: string;
    time: string;
    temperature: number;
    feelsLike: number;
    condition: string;
  };
  tempDifference: number; // destination - origin
  isSignificantGap: boolean;
  isShortTrip: boolean;
  alert?: SmartAlert;
  recommendedWear: OutfitItem[];
  packingAdvice: string[];
}
