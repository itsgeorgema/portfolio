"use client";
import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface CameraControllerProps {
  zoom: number;
  onCameraPositionChange?: (position: THREE.Vector3, isInHeroZone: boolean) => void;
}

export default function CameraController({ zoom, onCameraPositionChange }: CameraControllerProps) {
  const { camera, gl } = useThree();
  const basePositionRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const defaultPositionRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const [panOffset, setPanOffset] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const [targetPanOffset, setTargetPanOffset] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const [isInHeroZone, setIsInHeroZone] = useState(true);
  const [cameraTransition, setCameraTransition] = useState(0); // 0 = hero mode, 1 = normal mode
  const isDragging = useRef(false);
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    // Hero zone position: slight positive y, x=0, negative z (completely straight facing negative z)
    const heroPosition = new THREE.Vector3(0, 5, -90);
    
    // Default/normal position: current setup
    const baseDistance = 30;
    const angleY = Math.PI / 6; // 30 degrees
    const angleXZ = Math.PI / 4;
    
    const defaultPosition = new THREE.Vector3(
      baseDistance * Math.cos(angleXZ),
      baseDistance * Math.sin(angleY),
      baseDistance * Math.sin(angleXZ)
    );
    
    basePositionRef.current.copy(heroPosition);
    defaultPositionRef.current.copy(defaultPosition);
    camera.position.copy(heroPosition);
    // Make camera look straight down the negative z axis with slight downward angle
    camera.lookAt(0, 0, -100);
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
    const lerpFactor = 1 - Math.pow(0.01, delta);
    panOffset.lerp(targetPanOffset, lerpFactor);
    setPanOffset(panOffset.clone());
    
    // Calculate current camera position with pan offset (WITHOUT zoom for zone detection)
    const currentPanPosition = basePositionRef.current.clone().add(panOffset);
    
    // Check if we're in the hero zone (negative z area, in front of models)
    // Hero zone: z < -85 (sensitivity zone pushed to -85)
    // Use unzoomed position for zone detection to prevent zoom from triggering transitions
    const inHeroZone = currentPanPosition.z < -85;
    
    // Update hero zone state
    if (inHeroZone !== isInHeroZone) {
      setIsInHeroZone(inHeroZone);
    }
    
    // Smooth transition between hero and normal camera modes
    const targetTransition = inHeroZone ? 0 : 1;
    const transitionSpeed = 2.0; // Speed of transition
    const newTransition = THREE.MathUtils.lerp(cameraTransition, targetTransition, delta * transitionSpeed);
    setCameraTransition(newTransition);
    
    // Interpolate between hero position and normal camera behavior
    // Apply zoom ONLY to the final position calculation, not zone detection
    let finalPosition: THREE.Vector3;
    let lookAtTarget: THREE.Vector3;
    
    if (newTransition < 0.001) {
      // Pure hero mode - look straight down negative z axis with no x offset
      finalPosition = basePositionRef.current.clone().add(panOffset).multiplyScalar(zoom);
      lookAtTarget = new THREE.Vector3(panOffset.x, panOffset.y, panOffset.z - 100); // Look straight ahead into negative z
    } else if (newTransition > 0.999) {
      // Pure normal mode
      const scaledDefaultPosition = defaultPositionRef.current.clone().multiplyScalar(zoom);
      finalPosition = scaledDefaultPosition.clone().add(panOffset);
      lookAtTarget = panOffset.clone();
    } else {
      // Transitioning between modes
      const heroPos = basePositionRef.current.clone().add(panOffset).multiplyScalar(zoom);
      const normalPos = defaultPositionRef.current.clone().multiplyScalar(zoom).add(panOffset);
      finalPosition = heroPos.lerp(normalPos, newTransition);
      
      // Interpolate look-at target from hero direction to center
      const heroLookAt = new THREE.Vector3(panOffset.x, panOffset.y, panOffset.z - 100);
      const normalLookAt = panOffset.clone();
      lookAtTarget = heroLookAt.lerp(normalLookAt, newTransition);
    }
    
    camera.position.copy(finalPosition);
    camera.lookAt(lookAtTarget);
    
    // Notify parent component about camera position changes
    // Use the unzoomed position for consistency in UI feedback
    if (onCameraPositionChange) {
      onCameraPositionChange(currentPanPosition, inHeroZone);
    }
  });

  return null;
}
