import React from "react";
import { OutfitItem } from "@/types/rules";
import { COPY } from "@/config/copy";
import { Card } from "@/components/ui/Card";

interface OutfitListProps {
  items: OutfitItem[];
}

export const OutfitList: React.FC<OutfitListProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <span className="text-xs font-semibold text-asooo-muted uppercase tracking-wider">
        Outfit Essentials
      </span>

      <div className="grid grid-cols-1 gap-2.5">
        {items.map((item, idx) => {
          const categoryTitle =
            COPY.outfitCategories[item.category as keyof typeof COPY.outfitCategories] ||
            item.category;

          return (
            <Card
              key={`${item.category}-${idx}`}
              variant="surface"
              className="p-3.5 flex flex-col gap-1 border-asooo-border"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-asooo-dim uppercase tracking-wider">
                  {categoryTitle}
                </span>
                {item.isLayer && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 bg-ac-bg text-ac rounded-full">
                    Extra Layer
                  </span>
                )}
              </div>
              <p className="text-base font-semibold text-asooo-text leading-snug">
                {item.label}
              </p>
              <p className="text-xs text-asooo-muted font-normal leading-relaxed">
                {item.detail}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
