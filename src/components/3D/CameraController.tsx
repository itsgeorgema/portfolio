"use client";
import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface CameraControllerProps {
  zoom: number;
}

export default function CameraController({ zoom }: CameraControllerProps) {
  const { camera, gl } = useThree();
  const basePositionRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const [panOffset, setPanOffset] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const [targetPanOffset, setTargetPanOffset] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const isDragging = useRef(false);
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    // Set up a lower camera angle - more flat to the xy plane
    const baseDistance = 30;
    
    // Lower angle - closer to the xy plane (reduced from 45 degrees)
    const angleY = Math.PI / 6; // 30 degrees instead of 45
    const angleXZ = Math.PI / 4; // Keep some perspective
    
    const basePosition = new THREE.Vector3(
      baseDistance * Math.cos(angleXZ), // x
      baseDistance * Math.sin(angleY),  // y - lower height
      baseDistance * Math.sin(angleXZ)  // z
    );
    
    basePositionRef.current.copy(basePosition);
    camera.position.copy(basePosition);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleMouseDown = (event: MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: event.clientX, y: event.clientY };
      canvas.style.cursor = 'grabbing';
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging.current) return;

      const deltaX = event.clientX - previousMousePosition.current.x;
      const deltaY = event.clientY - previousMousePosition.current.y;

      const panSpeed = 0.07; // Increased sensitivity from 0.05 to 0.07
      
      // Get camera's current orientation vectors
      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection);
      
      // Get camera's right vector (perpendicular to forward direction)
      const cameraRight = new THREE.Vector3();
      cameraRight.crossVectors(camera.up, cameraDirection).normalize();
      
      // Get camera's forward vector (but keep it on the XZ plane for natural movement)
      const cameraForward = new THREE.Vector3();
      cameraForward.copy(cameraDirection);
      cameraForward.y = 0; // Remove Y component to keep movement on ground plane
      cameraForward.normalize();
      
      // Calculate movement relative to camera orientation (reversed controls)
      const rightMovement = cameraRight.clone().multiplyScalar(deltaX * panSpeed);
      const forwardMovement = cameraForward.clone().multiplyScalar(deltaY * panSpeed);
      
      // Combine the movements
      const panDelta = new THREE.Vector3();
      panDelta.add(rightMovement);
      panDelta.add(forwardMovement);

      setTargetPanOffset(prev => prev.clone().add(panDelta));
      
      previousMousePosition.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      canvas.style.cursor = 'grab';
    };

    const handleMouseLeave = () => {
      isDragging.current = false;
      canvas.style.cursor = 'grab';
    };

    // Set initial cursor
    canvas.style.cursor = 'grab';

    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [gl, camera]);

  useFrame((state, delta) => {
    // Smooth interpolation between current and target pan offset
    const lerpFactor = 1 - Math.pow(0.01, delta); // Smooth damping
    panOffset.lerp(targetPanOffset, lerpFactor);
    setPanOffset(panOffset.clone());
    
    // Calculate camera position: base position scaled by zoom, then add pan offset
    const scaledBasePosition = basePositionRef.current.clone().multiplyScalar(zoom);
    const finalPosition = scaledBasePosition.clone().add(panOffset);
    
    camera.position.copy(finalPosition);
    
    // Camera looks at center point adjusted by pan offset
    const lookAtTarget = panOffset.clone();
    camera.lookAt(lookAtTarget);
  });

  return null;
}
