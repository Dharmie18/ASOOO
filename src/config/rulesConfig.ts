export interface RulesThresholds {
  extremeHeat: number;      // feels-like >= 36°C
  hot: number;              // feels-like >= 30°C
  mild: number;             // feels-like >= 24°C
  cool: number;             // feels-like >= 18°C
  cold: number;             // feels-like < 18°C (e.g. Jos highlands, early morning Harmattan)
  highHumidity: number;     // relative humidity >= 75%
  rainLikely: number;       // precip probability >= 50%
  rainPossible: number;     // precip probability >= 25%
  strongSunUV: number;      // UV index >= 7.5
  harmattanHumidity: number;// humidity <= 25% (dry dusty air)
  tempGapNoticeable: number;// delta T >= 4°C
  tempGapMajor: number;     // delta T >= 7°C
}

export const RULES_CONFIG: {
  thresholds: RulesThresholds;
  weights: {
    rainWeight: number;
    sunWeight: number;
    tempWeight: number;
    acWeight: number;
  };
} = {
  thresholds: {
    extremeHeat: 36,
    hot: 30,
    mild: 24,
    cool: 18,
    cold: 17,
    highHumidity: 75,
    rainLikely: 50,
    rainPossible: 25,
    strongSunUV: 7.5,
    harmattanHumidity: 25,
    tempGapNoticeable: 4,
    tempGapMajor: 7,
  },
  weights: {
    rainWeight: 1.5,
    sunWeight: 1.2,
    tempWeight: 1.0,
    acWeight: 1.3,
  },
};
