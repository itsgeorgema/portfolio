"use client";
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useMemo } from 'react';
import * as THREE from 'three';
import { processIndividualObjects } from './ModelUtils';

import { Vec3Tuple } from '@/types/three';

export default function BarricadeSetModel({ position }: { position: Vec3Tuple }) {
  const gltf = useLoader(GLTFLoader, '/models/barricade_set.glb');
  
  const individualBarricades = useMemo(() => {
    const extractionLogic = (clonedScene: THREE.Group) => {
      const barricades: THREE.Group[] = [];
      
      // Navigate through the scene to find individual barricade objects
      clonedScene.traverse((child) => {
        if (child.name === 'RootNode') {
          child.children.forEach((barricadeObject) => {
            // Each child should be an individual barricade object
            const barricadeGroup = new THREE.Group();
            const barricadeClone = barricadeObject.clone();
            barricadeGroup.add(barricadeClone);
            barricades.push(barricadeGroup);
          });
        }
      });
      
      // If no RootNode found, try direct children approach
      if (barricades.length === 0) {
        clonedScene.children.forEach((child) => {
          const barricadeGroup = new THREE.Group();
          const barricadeClone = child.clone();
          barricadeGroup.add(barricadeClone);
          barricades.push(barricadeGroup);
        });
      }
      
      return barricades;
    };
    
    return processIndividualObjects(gltf.scene, extractionLogic, 8);
  }, [gltf.scene]);

  return (
    <group position={position}>
      {/* Render each individual barricade object */}
      {individualBarricades.map((barricadeGroup, index) => (
        <primitive key={`barricade-${index}`} object={barricadeGroup} />
      ))}
    </group>
  );
}
