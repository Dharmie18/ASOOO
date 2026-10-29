"use client";

import React from "react";
import { Header } from "@/components/navigation/Header";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Card } from "@/components/ui/Card";
import { COPY } from "@/config/copy";
import { ShieldCheck, Info } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between max-w-md mx-auto px-4 pb-24 w-full">
      <div className="flex flex-col gap-5">
        <Header locationName="Settings" onOpenLocationSearch={() => {}} />

        <main className="flex flex-col gap-6 py-2">
          <div className="flex flex-col gap-1">
            <h1 className="font-serif text-2xl font-bold text-asooo-text">
              {COPY.navigation.settings}
            </h1>
          </div>

          <Card variant="surface" className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-asooo-adire">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <h2 className="text-base font-bold">Privacy First</h2>
            </div>
            <p className="text-sm text-asooo-muted leading-relaxed">
              Asooo only uses your location coordinates in real-time to check the forecast. We do not store GPS trails, track movement, or share your data.
            </p>
          </Card>

          <Card variant="surface" className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-asooo-adire">
              <Info className="w-5 h-5 flex-shrink-0" />
              <h2 className="text-base font-bold">About {COPY.brand.name}</h2>
            </div>
            <p className="text-sm text-asooo-muted leading-relaxed">
              {COPY.brand.brandMeaning}. A weather-aware outfit advisor tailored for the Nigerian climate, interstate journeys, and indoor air conditioning.
            </p>
          </Card>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
