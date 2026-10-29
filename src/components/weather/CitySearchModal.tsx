"use client";

import React, { useState, useEffect, useRef } from "react";
import { GeocodeResult } from "@/types/weather";
import { searchLocations } from "@/lib/weatherService";
import { COPY } from "@/config/copy";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, MapPin, X, Loader2 } from "lucide-react";

interface CitySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: GeocodeResult) => void;
}

export const CitySearchModal: React.FC<CitySearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setHasSearched(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const clean = query.trim();
    if (clean.length < 2) {
      setResults([]);
      setIsLoading(false);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      const items = await searchLocations(clean);
      setResults(items);
      setIsLoading(false);
      setHasSearched(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/40 backdrop-blur-sm animate-fade-in"
    >
      <div className="w-full max-w-md bg-asooo-surface border border-asooo-border rounded-2xl shadow-card overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-4 border-b border-asooo-border">
          <span className="font-semibold text-asooo-text text-base">
            {COPY.onboarding.manualBtn}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 -mr-2 text-asooo-dim hover:text-asooo-text rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-asooo-border">
          <Input
            ref={inputRef}
            placeholder={COPY.trip.arrivalTownPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            icon={
              isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-asooo-adire" />
              ) : (
                <Search className="w-5 h-5" />
              )
            }
          />
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {isLoading && results.length === 0 && (
            <div className="p-8 text-center text-asooo-dim text-sm">
              {COPY.states.loadingWeather}
            </div>
          )}

          {!isLoading && hasSearched && results.length === 0 && (
            <div className="p-8 text-center text-asooo-dim text-sm">
              {COPY.states.placeNotFound}
            </div>
          )}

          {!hasSearched && !isLoading && (
            <div className="p-8 text-center text-asooo-dim text-sm">
              Search for any Nigerian town, state, or community.
            </div>
          )}

          <ul className="flex flex-col gap-1">
            {results.map((item) => (
              <li key={`${item.id}-${item.name}`}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="w-full min-h-[48px] px-3.5 py-2.5 flex items-center gap-3 rounded-xl hover:bg-asooo-subtle transition-colors text-left"
                >
                  <MapPin className="w-4 h-4 text-asooo-dim flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-asooo-text text-base leading-snug">
                      {item.name}
                    </span>
                    <span className="text-xs text-asooo-dim">
                      {item.state ? `${item.state}, Nigeria` : "Nigeria"}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
