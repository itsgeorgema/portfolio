"use client";
import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { getCarTarget, subscribeCarTarget, subscribeCarDriving } from './CarTrackingStore';

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
  const isInHeroZoneRef = useRef(true);
  const [cameraTransition, setCameraTransition] = useState(0); // 0 = hero mode, 1 = normal mode
  const [hasLeftHero, setHasLeftHero] = useState(false); // Track if car has ever left hero
  const isDragging = useRef(false);
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const followEnabledRef = useRef(true); // follow car target
  const lastKnownCarTarget = useRef<THREE.Vector3>(getCarTarget().clone());

  useEffect(() => {
    // Hero zone position: camera positioned in front of car, facing negative Z to see car front
    // Default/normal position (also used for hero; hero differs by zoom only)
    const baseDistance = 30;
    const angleY = Math.PI / 6; // 30 degrees
    const angleXZ = Math.PI / 4;
    
    const defaultPosition = new THREE.Vector3(
      baseDistance * Math.cos(angleXZ),
      baseDistance * Math.sin(angleY),
      baseDistance * Math.sin(angleXZ)
    );
    
    // Use the same base position for hero and normal; only zoom will change
    basePositionRef.current.copy(defaultPosition);
    defaultPositionRef.current.copy(defaultPosition);
    camera.position.copy(defaultPosition);
    // Look at scene origin initially
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  // Subscribe to car target updates
  useEffect(() => {
    const unsubTarget = subscribeCarTarget((pos) => {
      lastKnownCarTarget.current = pos.clone();
  // Always track car in hero; outside hero only when follow is enabled
  if (isInHeroZoneRef.current || followEnabledRef.current) {
        setTargetPanOffset(pos.clone());
      }
    });
    const unsubDriving = subscribeCarDriving(() => {
      // When driving toggles on, resume following
      followEnabledRef.current = true;
    });
    return () => { unsubTarget(); unsubDriving(); };
  }, []);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleMouseDown = (event: MouseEvent) => {
      // Disable dragging in hero zone
      if (isInHeroZoneRef.current) return;
      isDragging.current = true;
      followEnabledRef.current = false; // manual pan overrides follow temporarily
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
    // In hero: always follow the car target; outside: follow only when enabled and not dragging
    if (isInHeroZoneRef.current) {
      followEnabledRef.current = true; // force follow in hero
      setTargetPanOffset((prev) => prev.clone().lerp(lastKnownCarTarget.current, 0.35));
    } else if (followEnabledRef.current && !isDragging.current) {
      setTargetPanOffset((prev) => prev.clone().lerp(lastKnownCarTarget.current, 0.2));
    }

    const currentPanPosition = basePositionRef.current.clone().add(panOffset);
    
    // Check if we're in the hero zone using CAR position, not camera position
    const carPosition = lastKnownCarTarget.current;
    const inHeroZone = carPosition.z < -45; // Tiny hero zone near new spawn (-30)

    // Track if car has ever left hero (once left, stays in normal mode)
    if (!inHeroZone && !hasLeftHero) {
      setHasLeftHero(true);
    }
    
    // Update hero zone state
    if (inHeroZone !== isInHeroZone) setIsInHeroZone(inHeroZone);
    isInHeroZoneRef.current = inHeroZone;
    
    // Smooth transition between hero and normal camera modes
      // 0 in hero (zoomed in), 1 in normal (user zoom)
      const targetTransition = inHeroZone ? 0 : 1;
    const transitionSpeed = 2.0; // Speed of transition
    const newTransition = THREE.MathUtils.lerp(cameraTransition, targetTransition, delta * transitionSpeed);
    setCameraTransition(newTransition);
    
      // Keep the same angle/position in hero and normal; only zoom will change
      const finalPosition = defaultPositionRef.current.clone().add(panOffset);
      const lookAtTarget = panOffset.clone();
    
      // Zoom-only transition: lerp FOV between a tight hero FOV and the normal user FOV
      const baseFOV = 45;
      const normalFOV = THREE.MathUtils.clamp(baseFOV / zoom, 2, 120);
      const heroFOV = 7; 
      const blendedFOV = THREE.MathUtils.lerp(heroFOV, normalFOV, newTransition);
    if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = blendedFOV;
      camera.updateProjectionMatrix();
    }
    
    camera.position.copy(finalPosition);
    camera.lookAt(lookAtTarget);
    
    // Notify parent component about camera position changes
    // Use the unzoomed position for consistency in UI feedback
  if (onCameraPositionChange) onCameraPositionChange(currentPanPosition, inHeroZone);
  });

  return null;
}
