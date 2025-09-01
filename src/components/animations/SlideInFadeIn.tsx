"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SlideInFadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "left" | "right" | "up" | "down";
  distance?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export default function SlideInFadeIn({
  children,
  delay = 0,
  direction = "up",
  distance = 50,
  duration = 0.5,
  className = "",
  once = true,
}: SlideInFadeInProps) {
  const getInitialPosition = () => {
    switch (direction) {
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

  const initialPosition = getInitialPosition();

  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0, 
        x: initialPosition.x, 
        y: initialPosition.y 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once }}
      transition={{ 
        duration, 
        delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
}
