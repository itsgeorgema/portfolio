"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SlideOutFadeOutProps {
  children: ReactNode;
  delay?: number;
  direction?: "left" | "right" | "up" | "down";
  distance?: number;
  duration?: number;
  className?: string;
}

export default function SlideOutFadeOut({
  children,
  delay = 0,
  direction = "up",
  distance = 50,
  duration = 0.4,
  className = "",
}: SlideOutFadeOutProps) {
  const getAxisOffset = (dir: "left" | "right" | "up" | "down") => {
    switch (dir) {
      case "left":
        return { x: -distance, y: 0 };
      case "right":
        return { x: distance, y: 0 };
      case "up":
        return { x: 0, y: distance };
      case "down":
        return { x: 0, y: -distance };
      default:
        return { x: 0, y: distance };
    }
  };

  const initialOffset = getAxisOffset(direction);
  const exitOffset = getAxisOffset(direction);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: initialOffset.x, y: initialOffset.y, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: exitOffset.x, y: exitOffset.y, scale: 0.95 }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
