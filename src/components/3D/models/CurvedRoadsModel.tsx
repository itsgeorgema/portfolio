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
      
      // Load each individual object directly from the scene (no root structure)
      clonedScene.children.forEach((roadObject) => {
        const roadGroup = new THREE.Group();
        const roadClone = roadObject.clone();
        roadGroup.add(roadClone);
        roads.push(roadGroup);
      });
      
      return roads;
    };
    
    return processIndividualObjects(gltf.scene, extractionLogic, 8);
  }, [gltf.scene]);

  // Find the long_curve object
  const longCurveObject = useMemo(() => {
    return individualRoads.find(roadGroup => {
      let foundLongCurve = false;
      roadGroup.traverse((child) => {
        if (child.name === 'long_curve') {
          foundLongCurve = true;
        }
      });
      return foundLongCurve;
    });
  }, [individualRoads]);

  return (
    <group position={position}>
      {/* Render each individual road piece */}
      {individualRoads.map((roadGroup, index) => (
        <primitive key={`road-${index}`} object={roadGroup} />
      ))}
      
      {/* Duplicate the long_curve object and place it at positive z relative to original */}
      {longCurveObject && (
        <primitive 
          key="long-curve-duplicate" 
          object={longCurveObject.clone()} 
          position={[0, 0, 2]} // Place it 2 units in front (positive z) of the original
        />
      )}
    </group>
  );
}
