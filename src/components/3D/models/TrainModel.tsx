"use client";
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useMemo } from 'react';
import * as THREE from 'three';
import { processIndividualObjects } from './ModelUtils';

export default function TrainModel({ position }: { position: [number, number, number] }) {
  const gltf = useLoader(GLTFLoader, '/models/train.glb');
  
  const individualTrainParts = useMemo(() => {
    const extractionLogic = (clonedScene: THREE.Group) => {
      const trainParts: THREE.Group[] = [];
      
      // Navigate through the scene to find individual train objects
      clonedScene.traverse((child) => {
        if (child.name === 'RootNode') {
          child.children.forEach((trainObject) => {
            // Each child should be an individual train part
            const trainGroup = new THREE.Group();
            const trainClone = trainObject.clone();
            trainGroup.add(trainClone);
            trainParts.push(trainGroup);
          });
        }
      });
      
      // If no RootNode found, try direct children approach
      if (trainParts.length === 0) {
        clonedScene.children.forEach((child) => {
          const trainGroup = new THREE.Group();
          const trainClone = child.clone();
          trainGroup.add(trainClone);
          trainParts.push(trainGroup);
        });
      }
      
      return trainParts;
    };
    
    return processIndividualObjects(gltf.scene, extractionLogic, 12);
  }, [gltf.scene]);

  return (
    <group position={position}>
      {/* Render each individual train part */}
      {individualTrainParts.map((trainGroup, index) => (
        <primitive key={`train-${index}`} object={trainGroup} />
      ))}
    </group>
  );
}
