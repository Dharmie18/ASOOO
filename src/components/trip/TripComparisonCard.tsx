import React from "react";
import { TripComparisonOutput } from "@/types/rules";
import { Card } from "@/components/ui/Card";
import { AlertBanner } from "@/components/weather/AlertBanner";
import { OutfitList } from "@/components/weather/OutfitList";
import { ArrowRight, Luggage, Clock, CheckCircle2 } from "lucide-react";

interface TripComparisonCardProps {
  comparison: TripComparisonOutput;
}

export const TripComparisonCard: React.FC<TripComparisonCardProps> = ({
  comparison,
}) => {
  const {
    headline,
    originSummary,
    destinationSummary,
    tempDifference,
    alert,
    recommendedWear,
    packingAdvice,
  } = comparison;

  const isCooler = tempDifference < 0;
  const isWarmer = tempDifference > 0;
  const absDiff = Math.abs(tempDifference);

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <AlertBanner alert={alert} />

      <Card variant="surface" className="flex flex-col gap-4 border-asooo-border">
        <div className="flex items-center justify-between pb-3 border-b border-asooo-border/70">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-asooo-dim uppercase">
              Departure
            </span>
            <span className="font-bold text-asooo-text text-base">
              {originSummary.place}
            </span>
            <span className="text-xs text-asooo-muted flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" />
              {originSummary.time} • Feels {originSummary.feelsLike}°
            </span>
          </div>

          <div className="flex flex-col items-center px-2">
            <ArrowRight className="w-5 h-5 text-asooo-dim" />
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                isCooler
                  ? "bg-ac-bg text-ac"
                  : isWarmer
                  ? "bg-sun-bg text-sun"
                  : "bg-asooo-subtle text-asooo-muted"
              }`}
            >
              {isCooler
                ? `${absDiff}° cooler`
                : isWarmer
                ? `${absDiff}° warmer`
                : "Same temp"}
            </span>
          </div>

          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-asooo-dim uppercase">
              Arrival
            </span>
            <span className="font-bold text-asooo-text text-base">
              {destinationSummary.place}
            </span>
            <span className="text-xs text-asooo-muted flex items-center justify-end gap-1 mt-0.5">
              <Clock className="w-3 h-3" />
              {destinationSummary.time} • Feels {destinationSummary.feelsLike}°
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-asooo-text leading-snug">
            {headline}
          </h2>
        </div>
      </Card>

      {packingAdvice.length > 0 && (
        <Card variant="subtle" className="flex flex-col gap-2.5 bg-asooo-subtle/70">
          <div className="flex items-center gap-2 text-asooo-text font-bold text-sm">
            <Luggage className="w-4 h-4 text-asooo-adire" />
            <span>Transit & Packing Advice</span>
          </div>
          <ul className="flex flex-col gap-2">
            {packingAdvice.map((tip, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-asooo-muted leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-rain flex-shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <OutfitList items={recommendedWear} />
    </div>
  );
};
