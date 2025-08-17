import React from "react";
import Image from "next/image";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** CSS variable token without the leading --color-, e.g. "accent-cyan" */
  color?: string;
}

const containerPixelSizeByVariant: Record<NonNullable<LoadingSpinnerProps["size"]>, number> = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 80,
};

const borderWidthByVariant: Record<NonNullable<LoadingSpinnerProps["size"]>, number> = {
  xs: 2,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 4,
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "accent-white",
}) => {
  const containerSizePx = containerPixelSizeByVariant[size];
  const borderWidthPx = borderWidthByVariant[size];

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: containerSizePx, height: containerSizePx }}
      aria-label="Loading"
      role="status"
    >
      {/* Center icon (static) */}
      <Image
        src="/spinner.svg"
        alt="App icon"
        width={Math.round(containerSizePx * 0.55)}
        height={Math.round(containerSizePx * 0.55)}
        className="pointer-events-none select-none"
        style={{
          objectFit: "contain",
        }}
      />

      {/* Rotating circular border around the icon */}
      <div
        className="absolute inset-0 rounded-full animate-spin"
        style={{
          borderStyle: "solid",
          borderWidth: borderWidthPx,
          // Use CSS variable color system, e.g. --color-accent-cyan
          borderColor: `var(--color-${color})`,
          // Create a visible gap to suggest motion
          borderTopColor: "transparent",
        }}
      />
    </div>
  );
};

export default LoadingSpinner;