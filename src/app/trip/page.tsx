"use client";

import React, { useState, useEffect, useCallback } from "react";
import { WeatherData, GeocodeResult } from "@/types/weather";
import { PlaceType, TripComparisonOutput } from "@/types/rules";
import { COPY } from "@/config/copy";
import { evaluateTripAdvice } from "@/lib/rulesEngine";
import {
  fetchLiveWeather,
  getLastWeatherFromStorage,
} from "@/lib/weatherService";
import { Header } from "@/components/navigation/Header";
import { BottomNav } from "@/components/navigation/BottomNav";
import { TimeSelector } from "@/components/trip/TimeSelector";
import { TripComparisonCard } from "@/components/trip/TripComparisonCard";
import { CitySearchModal } from "@/components/weather/CitySearchModal";
import { PlaceTypeToggle } from "@/components/weather/PlaceTypeToggle";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { MapPin, Navigation, ArrowRight, Loader2 } from "lucide-react";

export default function TripPage() {
  const currentHour = new Date().getHours();
  const [departureHour, setDepartureHour] = useState<number>((currentHour + 1) % 24);
  const [arrivalHour, setArrivalHour] = useState<number>((currentHour + 4) % 24);
  const [placeType, setPlaceType] = useState<PlaceType>("both");

  const [originLocation, setOriginLocation] = useState<GeocodeResult | null>(null);
  const [destLocation, setDestLocation] = useState<GeocodeResult | null>(null);

  const [originWeather, setOriginWeather] = useState<WeatherData | null>(null);
  const [destWeather, setDestWeather] = useState<WeatherData | null>(null);
  const [comparison, setComparison] = useState<TripComparisonOutput | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [searchModalType, setSearchModalType] = useState<"origin" | "destination" | null>(null);

  useEffect(() => {
    const cached = getLastWeatherFromStorage();
    if (cached) {
      setOriginLocation({
        id: "current",
        name: cached.location.name,
        state: cached.location.state,
        country: "Nigeria",
        latitude: cached.location.latitude,
        longitude: cached.location.longitude,
      });
      setOriginWeather(cached);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const loc: GeocodeResult = {
          id: "current-gps",
          name: "Current Location",
          country: "Nigeria",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setOriginLocation(loc);
        fetchLiveWeather(pos.coords.latitude, pos.coords.longitude).then((data) => {
          setOriginWeather(data);
        }).catch(() => {});
      });
    }
  }, []);

  const handleCompare = useCallback(async () => {
    if (!originLocation || !destLocation) {
      setErrorMsg("Please select both your departure town and destination.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const [origW, destW] = await Promise.all([
        originWeather && originWeather.location.latitude === originLocation.latitude
          ? Promise.resolve(originWeather)
          : fetchLiveWeather(
              originLocation.latitude,
              originLocation.longitude,
              originLocation.name,
              originLocation.state
            ),
        fetchLiveWeather(
          destLocation.latitude,
          destLocation.longitude,
          destLocation.name,
          destLocation.state
        ),
      ]);

      setOriginWeather(origW);
      setDestWeather(destW);

      const result = evaluateTripAdvice(
        origW,
        departureHour,
        destW,
        arrivalHour,
        placeType
      );

      setComparison(result);
    } catch {
      setErrorMsg(COPY.states.networkError);
    } finally {
      setIsLoading(false);
    }
  }, [originLocation, destLocation, originWeather, departureHour, arrivalHour, placeType]);

  const handleSelectLocation = (loc: GeocodeResult) => {
    if (searchModalType === "origin") {
      setOriginLocation(loc);
      setOriginWeather(null);
    } else if (searchModalType === "destination") {
      setDestLocation(loc);
      setDestWeather(null);
    }
    setComparison(null);
    setSearchModalType(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between max-w-md mx-auto px-4 pb-24 w-full">
      <div className="flex flex-col gap-5">
        <Header
          locationName={originLocation?.name || "Trip Weather"}
          onOpenLocationSearch={() => setSearchModalType("origin")}
        />

        <main className="flex flex-col gap-6 py-1">
          <div className="flex flex-col gap-1">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-asooo-text leading-snug">
              {COPY.trip.title}
            </h1>
            <p className="text-sm text-asooo-muted">
              {COPY.trip.tagline}
            </p>
          </div>

          <Card variant="surface" className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-asooo-muted uppercase tracking-wider">
                {COPY.trip.departureLocationLabel}
              </label>
              <button
                type="button"
                onClick={() => setSearchModalType("origin")}
                className="w-full min-h-[48px] px-3.5 bg-asooo-subtle/70 hover:bg-asooo-subtle border border-asooo-border rounded-xl flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <Navigation className="w-4 h-4 text-asooo-adire flex-shrink-0" />
                  <span className="text-base font-semibold text-asooo-text truncate">
                    {originLocation?.name || "Select departure location"}
                  </span>
                </div>
                <span className="text-xs text-asooo-dim font-medium">Change</span>
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-asooo-muted uppercase tracking-wider">
                {COPY.trip.arrivalLocationLabel}
              </label>
              <button
                type="button"
                onClick={() => setSearchModalType("destination")}
                className="w-full min-h-[48px] px-3.5 bg-asooo-surface hover:bg-asooo-subtle border border-asooo-border rounded-xl flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-4 h-4 text-asooo-dim flex-shrink-0" />
                  <span
                    className={`text-base truncate ${
                      destLocation
                        ? "font-semibold text-asooo-text"
                        : "text-asooo-dim font-normal"
                    }`}
                  >
                    {destLocation ? `${destLocation.name}${destLocation.state ? `, ${destLocation.state}` : ""}` : COPY.trip.arrivalTownPlaceholder}
                  </span>
                </div>
                <span className="text-xs text-asooo-adire font-medium">
                  {destLocation ? "Change" : "Search"}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <TimeSelector
                label={COPY.trip.departureTimeLabel}
                value={departureHour}
                onChange={(h) => {
                  setDepartureHour(h);
                  setComparison(null);
                }}
              />
              <TimeSelector
                label={COPY.trip.arrivalTimeLabel}
                value={arrivalHour}
                onChange={(h) => {
                  setArrivalHour(h);
                  setComparison(null);
                }}
              />
            </div>

            <PlaceTypeToggle
              value={placeType}
              onChange={(pt) => {
                setPlaceType(pt);
                setComparison(null);
              }}
              adviceText=""
            />

            <Button
              fullWidth
              onClick={handleCompare}
              disabled={isLoading || !originLocation || !destLocation}
              className="mt-1"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{COPY.states.loadingTrip}</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>{COPY.trip.compareBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </Card>

          {errorMsg && (
            <div className="p-4 bg-asooo-surface border border-red-200 rounded-xl text-center text-sm text-red-600">
              {errorMsg}
            </div>
          )}

          {isLoading && !comparison && (
            <div className="flex flex-col gap-4 py-2">
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
            </div>
          )}

          {comparison && <TripComparisonCard comparison={comparison} />}
        </main>
      </div>

      <CitySearchModal
        isOpen={searchModalType !== null}
        onClose={() => setSearchModalType(null)}
        onSelect={handleSelectLocation}
      />

      <BottomNav />
    </div>
  );
}
