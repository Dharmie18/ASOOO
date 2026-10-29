import React from "react";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = "",
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      className={`inline-flex p-1 bg-asooo-subtle border border-asooo-border rounded-xl w-full gap-1 ${className}`}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.value)}
            className={`flex-1 min-h-[44px] px-3 py-2 text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-asooo-adire ${
              isSelected
                ? "bg-asooo-surface text-asooo-text shadow-sm border border-asooo-border"
                : "text-asooo-muted hover:text-asooo-text"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
