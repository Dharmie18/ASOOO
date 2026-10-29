import React from "react";

interface AnswerHeroProps {
  headline: string;
  supporting: string;
  temperatureSummary: string;
}

export const AnswerHero: React.FC<AnswerHeroProps> = ({
  headline,
  supporting,
  temperatureSummary,
}) => {
  return (
    <section className="flex flex-col gap-3 py-2">
      <div className="inline-flex items-center gap-2 self-start px-3 py-1 bg-asooo-subtle border border-asooo-border rounded-full text-xs font-semibold text-asooo-muted tracking-wide uppercase">
        <span>{temperatureSummary}</span>
      </div>

      <h1 className="font-serif text-2xl md:text-3xl font-bold text-asooo-text leading-snug tracking-tight">
        {headline}
      </h1>

      <p className="text-base text-asooo-muted leading-relaxed font-normal">
        {supporting}
      </p>
    </section>
  );
};
