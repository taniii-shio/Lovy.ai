import React from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "text-white bg-gradient-lovy shadow-lg hover:shadow-xl transform hover:scale-105",
  secondary:
    "text-gray-700 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50",
  ghost: "text-gray-600 hover:text-gray-800 hover:bg-gray-100",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "py-2 px-4 text-sm",
  md: "py-3 px-6 text-base",
  lg: "py-4 px-8 text-xl",
};

/**
 * Reusable Button component with consistent styling
 */
export default function Button({
  variant = "primary",
  size = "lg",
  fullWidth = false,
  className = "",
  disabled = false,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-bold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  const widthStyles = fullWidth ? "w-full" : "";

  const combinedClassName = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    widthStyles,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={combinedClassName}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
