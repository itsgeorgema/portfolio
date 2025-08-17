"use client";
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useMemo } from 'react';
import * as THREE from 'three';
import { processIndividualObjects } from './ModelUtils';

export default function Trees2Model({ position }: { position: [number, number, number] }) {
  const gltf = useLoader(GLTFLoader, '/models/trees2.glb');
  
  const individualTrees = useMemo(() => {
    const extractionLogic = (clonedScene: THREE.Group) => {
      const trees: THREE.Group[] = [];
      
      // Navigate to root node and then through circles/icospheres to get individual objects
      clonedScene.traverse((child) => {
        if (child.name === 'RootNode' || child.name === 'Scene') {
          child.children.forEach((circle) => {
            // Each circle/icosphere contains individual tree objects
            circle.children.forEach((tree) => {
              const treeGroup = new THREE.Group();
              const treeClone = tree.clone();
              treeGroup.add(treeClone);
              trees.push(treeGroup);
            });
          });
        }
      });
      
      // If no root node found, try direct approach
      if (trees.length === 0) {
        clonedScene.children.forEach((child) => {
          if (child.children.length > 0) {
            child.children.forEach((tree) => {
              const treeGroup = new THREE.Group();
              const treeClone = tree.clone();
              treeGroup.add(treeClone);
              trees.push(treeGroup);
            });
          } else {
            const treeGroup = new THREE.Group();
            const treeClone = child.clone();
            treeGroup.add(treeClone);
            trees.push(treeGroup);
          }
        });
      }
      
      return trees;
    };
    
    const trees = processIndividualObjects(gltf.scene, extractionLogic, 8);
    
    // Apply rotation to fix orientation
    trees.forEach(treeGroup => {
      treeGroup.rotation.x = -Math.PI / 2;
    });
    
    return trees;
  }, [gltf.scene]);

  return (
    <group position={position}>
      {/* Render each individual tree */}
      {individualTrees.map((treeGroup, index) => (
        <primitive key={`tree2-${index}`} object={treeGroup} />
      ))}
    </group>
  );
}
