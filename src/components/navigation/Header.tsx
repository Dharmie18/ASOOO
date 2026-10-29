"use client";

import React from "react";
import { COPY } from "@/config/copy";
import { MapPin, ChevronDown } from "lucide-react";

interface HeaderProps {
  locationName: string;
  onOpenLocationSearch: () => void;
  isOffline?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  locationName,
  onOpenLocationSearch,
  isOffline = false,
}) => {
  return (
    <header className="w-full flex items-center justify-between py-4 border-b border-asooo-border/60">
      <div className="flex flex-col">
        <span className="font-serif text-2xl font-bold tracking-tight text-asooo-adire">
          {COPY.brand.name}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {isOffline && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-harmattan-bg text-harmattan font-medium">
            Offline
          </span>
        )}
        <button
          type="button"
          onClick={onOpenLocationSearch}
          className="min-h-[44px] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-asooo-surface border border-asooo-border text-asooo-text hover:bg-asooo-subtle transition-all shadow-soft"
        >
          <MapPin className="w-4 h-4 text-asooo-dim" />
          <span className="text-sm font-semibold max-w-[150px] truncate">
            {locationName || "Choose Town"}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-asooo-dim" />
        </button>
      </div>
    </header>
  );
};
