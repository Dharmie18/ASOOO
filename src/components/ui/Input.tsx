import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-asooo-muted"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 pointer-events-none text-asooo-dim">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full min-h-[48px] bg-asooo-surface border border-asooo-border rounded-xl text-asooo-text placeholder:text-asooo-dim text-base focus:outline-none focus:ring-2 focus:ring-asooo-adire focus:border-transparent transition-all ${
              icon ? "pl-11 pr-4" : "px-4"
            } ${error ? "border-red-500" : ""} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
