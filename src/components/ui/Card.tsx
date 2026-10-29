import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "surface" | "subtle" | "outline";
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "surface",
  className = "",
  ...props
}) => {
  const variantStyles = {
    surface: "bg-asooo-surface border border-asooo-border shadow-soft",
    subtle: "bg-asooo-subtle border border-transparent",
    outline: "bg-transparent border border-asooo-border",
  };

  return (
    <div
      className={`rounded-2xl p-5 transition-all ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
