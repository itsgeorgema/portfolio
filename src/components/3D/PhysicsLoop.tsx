"use client";
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { usePhysics } from './PhysicsProvider';

export default function PhysicsLoop() {
  const { world } = usePhysics();
  const lastCallTimeRef = useRef<number | undefined>(undefined);
  const timeStep = 1 / 60; // 60 FPS

  useFrame(() => {
    const time = performance.now() / 1000; // seconds
    if (!lastCallTimeRef.current) {
      world.step(timeStep);
    } else {
      const dt = time - lastCallTimeRef.current;
      world.step(timeStep, dt);
    }
    lastCallTimeRef.current = time;
  });

  return null;
}
