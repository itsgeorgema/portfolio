"use client";
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useMemo } from 'react';
import { processSingleModel } from './ModelUtils';

export default function HumanModel({ position }: { position: [number, number, number] }) {
  const gltf = useLoader(GLTFLoader, '/models/human.glb');
  
  const processedScene = useMemo(() => {
    return processSingleModel(gltf.scene, 8);
  }, [gltf.scene]);

  return (
    <group position={position}>
      <primitive object={processedScene} />
    </group>
  );
}
