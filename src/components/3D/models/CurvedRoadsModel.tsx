"use client";
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useMemo } from 'react';
import * as THREE from 'three';
import { processIndividualObjects } from './ModelUtils';

import { Vec3Tuple } from '@/types/three';

export default function CurvedRoadsModel({ position }: { position: Vec3Tuple }) {
  const gltf = useLoader(GLTFLoader, '/models/curved_roads.glb');
  
  const individualRoads = useMemo(() => {
    const extractionLogic = (clonedScene: THREE.Group) => {
      const roads: THREE.Group[] = [];
      
      // Navigate through the specific structure: root → GLTF_SceneRootNode → individual track objects
      clonedScene.traverse((child) => {
        if (child.name === 'root') {
          child.children.forEach((sceneRoot) => {
            if (sceneRoot.name === 'GLTF_SceneRootNode') {
              sceneRoot.children.forEach((trackPiece) => {
                // Each child should be an individual track piece (Track_Corner_90, Track_Fence_line, etc.)
                const roadGroup = new THREE.Group();
                const roadClone = trackPiece.clone();
                roadGroup.add(roadClone);
                roads.push(roadGroup);
              });
            }
          });
        }
      });
      
      return roads;
    };
    
    return processIndividualObjects(gltf.scene, extractionLogic, 8);
  }, [gltf.scene]);

  return (
    <group position={position}>
      {/* Render each individual road piece */}
      {individualRoads.map((roadGroup, index) => (
        <primitive key={`road-${index}`} object={roadGroup} />
      ))}
    </group>
  );
}
