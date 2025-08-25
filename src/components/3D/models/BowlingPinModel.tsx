"use client";
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useMemo } from 'react';
import { processSingleModel } from './ModelUtils';
import { Vec3Tuple } from '@/types/three';

export default function BowlingPinModel({ position }: { position: Vec3Tuple }) {
  const gltf = useLoader(GLTFLoader, '/models/bowling_pin.glb');
  
  const processedScene = useMemo(() => {
    return processSingleModel(gltf.scene, 8);
  }, [gltf.scene]);

  return (
    <group position={position}>
      <primitive object={processedScene} />
    </group>
  );
}
