import React from "react";
import { COPY } from "@/config/copy";
import { PlaceType } from "@/types/rules";
import { SegmentedControl, SegmentOption } from "@/components/ui/SegmentedControl";

interface PlaceTypeToggleProps {
  value: PlaceType;
  onChange: (val: PlaceType) => void;
  adviceText: string;
}

export const PlaceTypeToggle: React.FC<PlaceTypeToggleProps> = ({
  value,
  onChange,
  adviceText,
}) => {
  const options: SegmentOption<PlaceType>[] = [
    { value: "outside", label: COPY.placeType.outside },
    { value: "inside_ac", label: COPY.placeType.insideAc },
    { value: "both", label: COPY.placeType.both },
  ];

  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-xs font-semibold text-asooo-muted uppercase tracking-wider">
        {COPY.placeType.title}
      </span>
      <SegmentedControl
        options={options}
        value={value}
        onChange={onChange}
      />
      {adviceText && (
        <p className="text-sm text-asooo-dim leading-snug px-1">
          {adviceText}
        </p>
      )}
    </div>
  );
};
