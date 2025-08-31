"use client";
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { usePhysics } from './PhysicsProvider';

export default function PhysicsLoop() {
  const { world } = usePhysics();
  const lastCallTimeRef = useRef<number | undefined>(undefined);
  const timeStep = 1 / 60; // 60 FPS
  const maxSubSteps = 3; // Limit substeps to prevent performance issues

  useFrame(() => {
    const time = performance.now() / 1000; // seconds
    if (!lastCallTimeRef.current) {
      world.step(timeStep);
    } else {
      const dt = time - lastCallTimeRef.current;
      // Clamp delta time to prevent large jumps that cause instability
      const clampedDt = Math.min(dt, timeStep * 4);
      world.step(timeStep, clampedDt, maxSubSteps);
    }
    lastCallTimeRef.current = time;
  });

  return null;
}
