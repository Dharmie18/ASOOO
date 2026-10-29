"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { COPY } from "@/config/copy";
import { Sun, Compass, Settings } from "lucide-react";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    {
      label: COPY.navigation.today,
      href: "/",
      icon: Sun,
      isActive: pathname === "/",
    },
    {
      label: COPY.navigation.trip,
      href: "/trip",
      icon: Compass,
      isActive: pathname === "/trip",
    },
    {
      label: COPY.navigation.settings,
      href: "/settings",
      icon: Settings,
      isActive: pathname === "/settings",
    },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-asooo-surface/90 backdrop-blur-md border-t border-asooo-border shadow-soft"
    >
      <div className="max-w-md mx-auto flex items-center justify-around px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center min-h-[56px] py-1 transition-colors ${
                item.isActive
                  ? "text-asooo-adire font-semibold"
                  : "text-asooo-dim hover:text-asooo-text font-medium"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
