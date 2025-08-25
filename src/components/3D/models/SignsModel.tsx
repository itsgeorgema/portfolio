"use client";
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useMemo } from 'react';
import * as THREE from 'three';
import { processIndividualObjects } from './ModelUtils';

import { Vec3Tuple } from '@/types/three';

export default function SignsModel({ position }: { position: Vec3Tuple }) {
  const gltf = useLoader(GLTFLoader, '/models/signs.glb');
  
  const individualSigns = useMemo(() => {
    const extractionLogic = (clonedScene: THREE.Group) => {
      const signs: THREE.Group[] = [];
      
      // Find the top-level objects (the 4 individual signs)
      clonedScene.children.forEach((child) => {
        if (child instanceof THREE.Group || child instanceof THREE.Mesh) {
          // Each child should be one of the 4 joined sign objects
          const signGroup = new THREE.Group();
          const childClone = child.clone();
          signGroup.add(childClone);
          signs.push(signGroup);
        }
      });
      
      return signs;
    };
    
    return processIndividualObjects(gltf.scene, extractionLogic, 8);
  }, [gltf.scene]);

  return (
    <group position={position}>
      {/* Render each of the 4 signs individually */}
      {individualSigns.map((signGroup, index) => (
        <primitive key={`sign-${index}`} object={signGroup} />
      ))}
    </group>
  );
}
