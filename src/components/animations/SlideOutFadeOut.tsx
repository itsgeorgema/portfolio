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
  isVisible?: boolean;
}

export default function SlideOutFadeOut({
  children,
  delay = 0,
  direction = "up",
  distance = 50,
  duration = 0.4,
  className = "",
  isVisible = true,
}: SlideOutFadeOutProps) {
  const getExitPosition = () => {
    switch (direction) {
      case "left":
        return { x: -distance, y: 0 };
      case "right":
        return { x: distance, y: 0 };
      case "up":
        return { x: 0, y: -distance };
      case "down":
        return { x: 0, y: distance };
      default:
        return { x: 0, y: -distance };
    }
  };

  const exitPosition = getExitPosition();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 1, x: 0, y: 0 }}
      animate={
        isVisible
          ? { opacity: 1, x: 0, y: 0 }
          : { 
              opacity: 0, 
              x: exitPosition.x, 
              y: exitPosition.y 
            }
      }
      transition={{ 
        duration, 
        delay,
        ease: "easeIn"
      }}
    >
      {children}
    </motion.div>
  );
}
