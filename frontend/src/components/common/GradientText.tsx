import React from "react";

export interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
}

/**
 * Text component with gradient styling
 */
export default function GradientText({
  children,
  className = "",
  as: Component = "span",
}: GradientTextProps) {
  const gradientClassName = "bg-gradient-lovy bg-clip-text text-transparent";
  const combinedClassName = [gradientClassName, className]
    .filter(Boolean)
    .join(" ");

  return <Component className={combinedClassName}>{children}</Component>;
}
