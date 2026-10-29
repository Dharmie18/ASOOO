import React from "react";

interface TimeSelectorProps {
  label: string;
  value: number;
  onChange: (hour: number) => void;
  className?: string;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  label,
  value,
  onChange,
  className = "",
}) => {
  const hours = Array.from({ length: 24 }).map((_, i) => {
    let text = "";
    if (i === 0) text = "12:00 AM (Midnight)";
    else if (i === 12) text = "12:00 PM (Noon)";
    else if (i < 12) text = `${i}:00 AM`;
    else text = `${i - 12}:00 PM`;
    return { hour: i, text };
  });

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      <label className="text-xs font-semibold text-asooo-muted uppercase tracking-wider">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full min-h-[48px] px-3.5 bg-asooo-surface border border-asooo-border rounded-xl text-asooo-text text-base font-medium focus:outline-none focus:ring-2 focus:ring-asooo-adire transition-all cursor-pointer"
      >
        {hours.map((h) => (
          <option key={h.hour} value={h.hour}>
            {h.text}
          </option>
        ))}
      </select>
    </div>
  );
};
