"use client";
import * as THREE from 'three';

// Helper function to preserve material properties
export function preserveMaterial(material: THREE.Material) {
  if (material instanceof THREE.MeshStandardMaterial) {
    material.needsUpdate = true;
    if (material.map) material.map.needsUpdate = true;
    if (material.normalMap) material.normalMap.needsUpdate = true;
    if (material.roughnessMap) material.roughnessMap.needsUpdate = true;
    if (material.metalnessMap) material.metalnessMap.needsUpdate = true;
    if (material.emissiveMap) material.emissiveMap.needsUpdate = true;
    if (material.aoMap) material.aoMap.needsUpdate = true;
  } else if (material instanceof THREE.MeshBasicMaterial) {
    material.needsUpdate = true;
    if (material.map) material.map.needsUpdate = true;
  } else if (material instanceof THREE.MeshLambertMaterial) {
    material.needsUpdate = true;
    if (material.map) material.map.needsUpdate = true;
    if (material.emissiveMap) material.emissiveMap.needsUpdate = true;
  } else if (material instanceof THREE.MeshPhongMaterial) {
    material.needsUpdate = true;
    if (material.map) material.map.needsUpdate = true;
    if (material.normalMap) material.normalMap.needsUpdate = true;
    if (material.emissiveMap) material.emissiveMap.needsUpdate = true;
  }
}

// Function to process materials for an object
export function processMaterials(object: THREE.Object3D) {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach(preserveMaterial);
      } else {
        preserveMaterial(child.material);
      }
      child.castShadow = false;
      child.receiveShadow = false;
    }
  });
}

// Helper function for standard single-object model processing
export function processSingleModel(scene: THREE.Group, scaleTarget: number = 8) {
  const clonedScene = scene.clone();
  processMaterials(clonedScene);
  
  const box = new THREE.Box3().setFromObject(clonedScene);
  const size = box.getSize(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z);
  
  if (maxDimension > 0) {
    const scale = scaleTarget / maxDimension;
    clonedScene.scale.setScalar(scale);
    const center = box.getCenter(new THREE.Vector3());
    center.multiplyScalar(scale);
    clonedScene.position.set(-center.x, -box.min.y * scale, -center.z);
  }
  
  return clonedScene;
}

// Helper function for individual object extraction and processing
export function processIndividualObjects(
  scene: THREE.Group,
  extractionLogic: (clonedScene: THREE.Group) => THREE.Group[],
  scaleTarget: number = 8
) {
  const clonedScene = scene.clone();
  const objects = extractionLogic(clonedScene);
  
  // Process materials for all object groups
  objects.forEach(objectGroup => {
    processMaterials(objectGroup);
  });
  
  // Calculate scaling based on the full scene
  const fullBox = new THREE.Box3().setFromObject(clonedScene);
  const fullSize = fullBox.getSize(new THREE.Vector3());
  const maxDimension = Math.max(fullSize.x, fullSize.y, fullSize.z);
  
  if (maxDimension > 0) {
    const scale = scaleTarget / maxDimension;
    
    // Apply same scaling to all object groups
    objects.forEach(objectGroup => {
      objectGroup.scale.setScalar(scale);
    });
    
    // Position all objects to maintain their relative positions
    const center = fullBox.getCenter(new THREE.Vector3());
    center.multiplyScalar(scale);
    
    objects.forEach(objectGroup => {
      objectGroup.position.set(-center.x, -fullBox.min.y * scale, -center.z);
    });
  }
  
  return objects;
}
