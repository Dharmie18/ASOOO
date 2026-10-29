"use client";

import React, { useRef, useState, useEffect } from "react";
import { AdviceOutput } from "@/types/rules";
import { LocationInfo } from "@/types/weather";
import { COPY } from "@/config/copy";
import { Button } from "@/components/ui/Button";
import { Share2, Download, X, Check, Loader2 } from "lucide-react";

interface WhatsAppShareCardProps {
  isOpen: boolean;
  onClose: () => void;
  advice: AdviceOutput;
  location: LocationInfo;
}

export const WhatsAppShareCard: React.FC<WhatsAppShareCardProps> = ({
  isOpen,
  onClose,
  advice,
  location,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setImageUrl(null);
      return;
    }

    setIsGenerating(true);
    const canvas = document.createElement("canvas");
    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // 1. Background - Soft unbleached cotton warm off-white (#FBF9F5)
    ctx.fillStyle = "#FBF9F5";
    ctx.fillRect(0, 0, width, height);

    // 2. Editorial Adire indigo header banner / subtle framing
    ctx.fillStyle = "#1A2744";
    ctx.fillRect(0, 0, width, 14);

    // 3. Brand & Watermark
    ctx.fillStyle = "#1A2744";
    ctx.font = "bold 56px serif";
    ctx.fillText("Asooo", 80, 150);

    ctx.fillStyle = "#78716C";
    ctx.font = "500 28px sans-serif";
    ctx.fillText("What to wear today", 80, 195);

    // Date & Location Pill
    const dateStr = new Date().toLocaleDateString("en-NG", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
    ctx.fillStyle = "#F2EFE9";
    roundRect(ctx, width - 480, 105, 400, 80, 40);
    ctx.fill();

    ctx.fillStyle = "#1C1917";
    ctx.font = "600 26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${location.name} • ${dateStr}`, width - 280, 155);
    ctx.textAlign = "left";

    // 4. Feels-like chip
    ctx.fillStyle = "#FEF3C7";
    roundRect(ctx, 80, 290, 280, 64, 32);
    ctx.fill();

    ctx.fillStyle = "#C27803";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText(advice.temperatureSummary.toUpperCase(), 115, 332);

    // 5. Big Answer Headline (Playfair Display / Serif style)
    ctx.fillStyle = "#1C1917";
    ctx.font = "bold 64px serif";
    const headlineLines = wrapText(ctx, advice.headline, width - 160);
    let currentY = 440;
    headlineLines.forEach((line) => {
      ctx.fillText(line, 80, currentY);
      currentY += 85;
    });

    // Supporting Line
    ctx.fillStyle = "#57534E";
    ctx.font = "normal 34px sans-serif";
    const supportingLines = wrapText(ctx, advice.supporting, width - 160);
    currentY += 20;
    supportingLines.forEach((line) => {
      ctx.fillText(line, 80, currentY);
      currentY += 50;
    });

    // 6. Alert (if exists)
    if (advice.alert) {
      currentY += 30;
      ctx.fillStyle = "#FEF9C3";
      roundRect(ctx, 80, currentY, width - 160, 130, 24);
      ctx.fill();

      ctx.strokeStyle = "#FDE047";
      ctx.lineWidth = 2;
      roundRect(ctx, 80, currentY, width - 160, 130, 24);
      ctx.stroke();

      ctx.fillStyle = "#B45309";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText(advice.alert.title, 120, currentY + 50);

      ctx.fillStyle = "#78350F";
      ctx.font = "500 26px sans-serif";
      ctx.fillText(advice.alert.action, 120, currentY + 95);

      currentY += 160;
    } else {
      currentY += 50;
    }

    // 7. Divider Line
    ctx.strokeStyle = "#E7E5E4";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, currentY);
    ctx.lineTo(width - 80, currentY);
    ctx.stroke();

    currentY += 70;

    // 8. Outfit Essentials Heading
    ctx.fillStyle = "#78716C";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText("TODAY'S OUTFIT ESSENTIALS", 80, currentY);
    currentY += 50;

    // 9. Outfit Cards
    advice.essentials.slice(0, 4).forEach((item) => {
      ctx.fillStyle = "#FFFFFF";
      roundRect(ctx, 80, currentY, width - 160, 125, 20);
      ctx.fill();

      ctx.strokeStyle = "#E7E5E4";
      ctx.lineWidth = 2;
      roundRect(ctx, 80, currentY, width - 160, 125, 20);
      ctx.stroke();

      ctx.fillStyle = "#78716C";
      ctx.font = "600 22px sans-serif";
      ctx.fillText(item.category.toUpperCase(), 120, currentY + 45);

      ctx.fillStyle = "#1C1917";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText(item.label, 120, currentY + 88);

      currentY += 150;
    });

    // 10. Footer / Brand Watermark
    ctx.fillStyle = "#A8A29E";
    ctx.font = "500 26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(COPY.shareCard.watermark, width / 2, height - 70);

    const generatedUrl = canvas.toDataURL("image/png");
    setImageUrl(generatedUrl);
    setIsGenerating(false);
  }, [isOpen, advice, location]);

  const handleShareOrDownload = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "asooo-today-outfit.png", {
        type: "image/png",
      });

      if (
        navigator.canShare &&
        navigator.canShare({ files: [file] }) &&
        navigator.share
      ) {
        await navigator.share({
          title: "My Outfit for Today on Asooo",
          text: advice.headline,
          files: [file],
        });
        return;
      }
    } catch {}

    // Fallback: direct download link
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `asooo-${location.name.toLowerCase().replace(/\s+/g, "-")}-outfit.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="w-full max-w-sm bg-asooo-surface border border-asooo-border rounded-2xl shadow-card overflow-hidden flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between p-4 border-b border-asooo-border">
          <span className="font-semibold text-asooo-text text-base">
            {COPY.shareCard.modalTitle}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 -mr-2 text-asooo-dim hover:text-asooo-text rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center">
          {isGenerating || !imageUrl ? (
            <div className="flex flex-col items-center gap-3 py-16 text-asooo-dim">
              <Loader2 className="w-8 h-8 animate-spin text-asooo-adire" />
              <span className="text-sm">Creating your status card...</span>
            </div>
          ) : (
            <div className="w-full relative rounded-xl overflow-hidden shadow-card border border-asooo-border aspect-[9/16]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Today's outfit card preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-asooo-border flex flex-col gap-2">
          <Button
            fullWidth
            onClick={handleShareOrDownload}
            disabled={isGenerating || !imageUrl}
          >
            {copied ? (
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Image Saved!</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                <span>{COPY.shareCard.buttonLabel}</span>
              </span>
            )}
          </Button>
          <Button fullWidth variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0] || "";

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}
