"use client";
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useMemo } from 'react';
import * as THREE from 'three';
import { processIndividualObjects } from './ModelUtils';

export default function TreesModel({ position }: { position: [number, number, number] }) {
  const gltf = useLoader(GLTFLoader, '/models/trees.glb');
  
  const individualTrees = useMemo(() => {
    const extractionLogic = (clonedScene: THREE.Group) => {
      const trees: THREE.Group[] = [];
      
      // Navigate to root node and load each individual tree
      clonedScene.traverse((child) => {
        if (child.name === 'RootNode' || child.name === 'Scene') {
          child.children.forEach((tree) => {
            const treeGroup = new THREE.Group();
            const treeClone = tree.clone();
            treeGroup.add(treeClone);
            trees.push(treeGroup);
          });
        }
      });
      
      // If no root node found, load top-level children
      if (trees.length === 0) {
        clonedScene.children.forEach((child) => {
          const treeGroup = new THREE.Group();
          const treeClone = child.clone();
          treeGroup.add(treeClone);
          trees.push(treeGroup);
        });
      }
      
      return trees;
    };
    
    return processIndividualObjects(gltf.scene, extractionLogic, 8);
  }, [gltf.scene]);

  return (
    <group position={position}>
      {/* Render each individual tree */}
      {individualTrees.map((treeGroup, index) => (
        <primitive key={`tree-${index}`} object={treeGroup} />
      ))}
    </group>
  );
}
