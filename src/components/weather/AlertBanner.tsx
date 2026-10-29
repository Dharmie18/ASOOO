import React from "react";
import { SmartAlert } from "@/types/rules";
import { CloudRain, Sun, Wind, ArrowUpDown } from "lucide-react";

interface AlertBannerProps {
  alert?: SmartAlert;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alert }) => {
  if (!alert) return null;

  const styleMap = {
    rain: {
      bg: "bg-rain-bg text-rain border-rain/30",
      icon: <CloudRain className="w-5 h-5 flex-shrink-0" />,
    },
    sun: {
      bg: "bg-sun-bg text-sun border-sun/30",
      icon: <Sun className="w-5 h-5 flex-shrink-0" />,
    },
    harmattan: {
      bg: "bg-harmattan-bg text-harmattan border-harmattan/30",
      icon: <Wind className="w-5 h-5 flex-shrink-0" />,
    },
    temp_gap: {
      bg: "bg-ac-bg text-ac border-ac/30",
      icon: <ArrowUpDown className="w-5 h-5 flex-shrink-0" />,
    },
  };

  const currentStyle = styleMap[alert.type] || styleMap.sun;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-xl border ${currentStyle.bg} transition-all`}
    >
      <div className="mt-0.5">{currentStyle.icon}</div>
      <div className="flex flex-col gap-0.5">
        <h2 className="text-sm font-bold tracking-tight">{alert.title}</h2>
        <p className="text-sm font-medium opacity-90 leading-snug">
          {alert.action}
        </p>
      </div>
    </div>
  );
};
