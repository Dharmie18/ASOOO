"use client";

import React, { useState, useEffect, useCallback } from "react";
import { WeatherData, GeocodeResult } from "@/types/weather";
import { PlaceType, AdviceOutput } from "@/types/rules";
import { COPY } from "@/config/copy";
import { evaluateTodayAdvice } from "@/lib/rulesEngine";
import {
  fetchLiveWeather,
  getLastWeatherFromStorage,
} from "@/lib/weatherService";
import { Header } from "@/components/navigation/Header";
import { BottomNav } from "@/components/navigation/BottomNav";
import { AnswerHero } from "@/components/weather/AnswerHero";
import { PlaceTypeToggle } from "@/components/weather/PlaceTypeToggle";
import { AlertBanner } from "@/components/weather/AlertBanner";
import { OutfitList } from "@/components/weather/OutfitList";
import { CitySearchModal } from "@/components/weather/CitySearchModal";
import { WhatsAppShareCard } from "@/components/share/WhatsAppShareCard";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { MapPin, RefreshCw, AlertCircle, Share2 } from "lucide-react";

export default function TodayPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [placeType, setPlaceType] = useState<PlaceType>("both");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [needsLocationPrompt, setNeedsLocationPrompt] = useState<boolean>(false);

  const loadWeatherForCoords = useCallback(
    async (lat: number, lon: number, name = "Your Location", state = "") => {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const data = await fetchLiveWeather(lat, lon, name, state);
        setWeather(data);
        setIsOffline(false);
      } catch {
        const cached = getLastWeatherFromStorage();
        if (cached) {
          setWeather(cached);
          setIsOffline(true);
        } else {
          setErrorMsg(COPY.states.networkError);
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const requestBrowserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setNeedsLocationPrompt(true);
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setNeedsLocationPrompt(false);
        loadWeatherForCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        const cached = getLastWeatherFromStorage();
        if (cached) {
          setWeather(cached);
          setIsLoading(false);
        } else {
          setNeedsLocationPrompt(true);
          setIsLoading(false);
        }
      },
      { timeout: 8000 }
    );
  }, [loadWeatherForCoords]);

  useEffect(() => {
    const cached = getLastWeatherFromStorage();
    if (cached) {
      setWeather(cached);
      loadWeatherForCoords(
        cached.location.latitude,
        cached.location.longitude,
        cached.location.name,
        cached.location.state
      );
    } else {
      requestBrowserLocation();
    }
  }, [loadWeatherForCoords, requestBrowserLocation]);

  const handleSelectLocation = (loc: GeocodeResult) => {
    setNeedsLocationPrompt(false);
    loadWeatherForCoords(loc.latitude, loc.longitude, loc.name, loc.state);
  };

  const advice: AdviceOutput | null = weather
    ? evaluateTodayAdvice(weather, placeType)
    : null;

  return (
    <div className="min-h-screen flex flex-col justify-between max-w-md mx-auto px-4 pb-24 w-full">
      <div className="flex flex-col gap-5">
        <Header
          locationName={weather?.location.name || ""}
          onOpenLocationSearch={() => setIsSearchOpen(true)}
          isOffline={isOffline}
        />

        {isOffline && weather?.fetchedAt && (
          <div className="p-3 bg-harmattan-bg border border-harmattan/30 rounded-xl text-xs text-harmattan font-medium">
            {COPY.states.offlineNote(
              new Date(weather.fetchedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            )}
          </div>
        )}

        {needsLocationPrompt && !weather && (
          <section className="flex flex-col items-center text-center p-6 bg-asooo-surface border border-asooo-border rounded-2xl shadow-soft gap-4 my-8">
            <div className="w-12 h-12 rounded-full bg-asooo-subtle flex items-center justify-center text-asooo-adire">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="font-serif text-xl font-bold text-asooo-text">
                {COPY.onboarding.title}
              </h2>
              <p className="text-sm text-asooo-muted">
                {COPY.onboarding.subtitle}
              </p>
            </div>
            <div className="flex flex-col w-full gap-2.5 mt-2">
              <Button fullWidth onClick={requestBrowserLocation}>
                {COPY.onboarding.useLocationBtn}
              </Button>
              <Button
                fullWidth
                variant="secondary"
                onClick={() => setIsSearchOpen(true)}
              >
                {COPY.onboarding.manualBtn}
              </Button>
            </div>
          </section>
        )}

        {isLoading && !weather && (
          <div className="flex flex-col gap-5 py-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-5 w-3/4 rounded-lg" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="flex flex-col gap-2.5 mt-4">
              <Skeleton className="h-16 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
            </div>
          </div>
        )}

        {errorMsg && !weather && (
          <div className="p-6 bg-asooo-surface border border-asooo-border rounded-2xl text-center flex flex-col items-center gap-3 my-8">
            <AlertCircle className="w-8 h-8 text-asooo-dim" />
            <p className="text-sm text-asooo-muted">{errorMsg}</p>
            <Button
              variant="secondary"
              onClick={() => setIsSearchOpen(true)}
              className="mt-2"
            >
              {COPY.onboarding.manualBtn}
            </Button>
          </div>
        )}

        {advice && (
          <main className="flex flex-col gap-6">
            <AlertBanner alert={advice.alert} />

            <AnswerHero
              headline={advice.headline}
              supporting={advice.supporting}
              temperatureSummary={advice.temperatureSummary}
            />

            <PlaceTypeToggle
              value={placeType}
              onChange={setPlaceType}
              adviceText={advice.placeTypeAdvice}
            />

            <OutfitList items={advice.essentials} />

            <Button
              fullWidth
              variant="secondary"
              onClick={() => setIsShareOpen(true)}
              className="mt-1 flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4 text-asooo-adire" />
              <span>{COPY.shareCard.buttonLabel}</span>
            </Button>

            <div className="flex items-center justify-between pt-2 pb-4">
              <button
                type="button"
                onClick={() => {
                  if (weather) {
                    loadWeatherForCoords(
                      weather.location.latitude,
                      weather.location.longitude,
                      weather.location.name,
                      weather.location.state
                    );
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs text-asooo-dim hover:text-asooo-text transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{COPY.states.retryBtn}</span>
              </button>

              <p className="text-[11px] text-asooo-dim">
                {COPY.seasonalTip.elNinoNotice}
              </p>
            </div>
          </main>
        )}
      </div>

      <CitySearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleSelectLocation}
      />

      {weather && advice && (
        <WhatsAppShareCard
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          advice={advice}
          location={weather.location}
        />
      )}

      <BottomNav />
    </div>
  );
}
