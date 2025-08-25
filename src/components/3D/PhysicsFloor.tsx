"use client";
import { useEffect } from 'react';
import * as CANNON from 'cannon-es';
import { usePhysics } from './PhysicsProvider';

export default function PhysicsFloor() {
  const { world } = usePhysics();

  useEffect(() => {
    // Create physics floor
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body();
    floorBody.mass = 0; // Static body

    floorBody.addShape(floorShape);
    world.addBody(floorBody);

    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5
    );

    return () => {
      world.removeBody(floorBody);
    };
  }, [world]);

  return null;
}
