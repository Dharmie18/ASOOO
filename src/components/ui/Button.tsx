import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "subtle" | "outline";
  size?: "default" | "sm" | "lg";
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "default",
      fullWidth = false,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-asooo-adire focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "h-10 px-3 text-sm",
      default: "min-h-[48px] px-5 text-base",
      lg: "min-h-[52px] px-6 text-lg",
    };

    const variantStyles = {
      primary:
        "bg-asooo-adire text-white hover:bg-opacity-95 shadow-soft border border-transparent",
      secondary:
        "bg-asooo-surface text-asooo-text border border-asooo-border hover:bg-asooo-subtle shadow-soft",
      subtle:
        "bg-asooo-subtle text-asooo-text hover:bg-opacity-80 border border-transparent",
      outline:
        "bg-transparent text-asooo-text border border-asooo-border hover:bg-asooo-subtle",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
