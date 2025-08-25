"use client";
import { createContext, useContext, ReactNode, useMemo } from 'react';
import * as CANNON from 'cannon-es';

interface PhysicsContextType {
  world: CANNON.World;
}

const PhysicsContext = createContext<PhysicsContextType | null>(null);

export const usePhysics = () => {
  const context = useContext(PhysicsContext);
  if (!context) {
    throw new Error('usePhysics must be used within a PhysicsProvider');
  }
  return context;
};

interface PhysicsProviderProps {
  children: ReactNode;
}

export function PhysicsProvider({ children }: PhysicsProviderProps) {
  // Create physics world with useMemo to prevent recreation
  const world = useMemo(() => {
    const newWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
    });
    newWorld.broadphase = new CANNON.SAPBroadphase(newWorld);

    // Create materials and contact materials
    const bodyMaterial = new CANNON.Material();
    const groundMaterial = new CANNON.Material();
    const bodyGroundContactMaterial = new CANNON.ContactMaterial(
      bodyMaterial,
      groundMaterial,
      {
        friction: 0.1,
        restitution: 0.3
      }
    );
    newWorld.addContactMaterial(bodyGroundContactMaterial);
    
    return newWorld;
  }, []); // Empty dependency array ensures world is created only once

  return (
    <PhysicsContext.Provider value={{ world }}>
      {children}
    </PhysicsContext.Provider>
  );
}
