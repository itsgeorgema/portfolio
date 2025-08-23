"use client";
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState, useRef } from 'react';
import ModelGrid from './ModelGrid';
import CameraController from './CameraController';
import Lighting from './Lighting';
import Environment from './Environment';
import Footer from '../Footer';
import AnimatedTitle from '../AnimatedTitle';
import * as THREE from 'three';
import { nardoGrayColors } from '@/styles/colors';

export default function Scene3D() {
  const [zoom, setZoom] = useState(1);
  const [targetZoom, setTargetZoom] = useState(1);
  const [isInHeroZone, setIsInHeroZone] = useState(true);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);
  const isInHeroZoneRef = useRef(true); // Use ref to avoid dependency issues
  const targetZoomRef = useRef(1); // Also use ref for targetZoom to avoid stale closures
  const nardoGray = nardoGrayColors.primary[500];

  // Update refs when state changes
  useEffect(() => {
    isInHeroZoneRef.current = isInHeroZone;
  }, [isInHeroZone]);

  useEffect(() => {
    targetZoomRef.current = targetZoom;
  }, [targetZoom]);

  // Handle camera position changes
  const handleCameraPositionChange = (position: THREE.Vector3, inHeroZone: boolean) => {
    setIsInHeroZone(inHeroZone);
    
    // Set opacity based on hero zone state: fade out when transitioning out of hero zone
    setHeroOpacity(inHeroZone ? 1 : 0);
  };

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const handleWheel = (event: WheelEvent) => {
      // Only allow zoom when NOT in hero zone (use ref to avoid dependency issues)
      if (isInHeroZoneRef.current) {
        event.preventDefault();
        return; // Exit early, no zoom in hero section
      }
      
      // Only prevent default and handle zoom when the mouse is over the 3D canvas and not in hero zone
      event.preventDefault();
      const zoomSpeed = 0.08; // Increased sensitivity from 0.05 to 0.08
      const currentTargetZoom = targetZoomRef.current;
      const newZoom = currentTargetZoom + (event.deltaY > 0 ? zoomSpeed : -zoomSpeed);
      const clampedZoom = Math.max(0.8, Math.min(4, newZoom));
      setTargetZoom(clampedZoom);
    };

    // Add wheel event listener only to the canvas container
    canvasElement.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvasElement.removeEventListener('wheel', handleWheel);
  }, []); // Empty dependency array to avoid any size changes

  // Smooth zoom interpolation
  useEffect(() => {
    const smoothZoom = () => {
      const lerpFactor = 0.1; // Smooth zoom speed
      const newZoom = zoom + (targetZoom - zoom) * lerpFactor;
      if (Math.abs(targetZoom - newZoom) > 0.001) {
        setZoom(newZoom);
        requestAnimationFrame(smoothZoom);
      } else {
        setZoom(targetZoom);
      }
    };
    
    if (Math.abs(targetZoom - zoom) > 0.001) {
      requestAnimationFrame(smoothZoom);
    }
  }, [targetZoom, zoom]);

  return (
    <div ref={canvasRef} className="w-full h-screen relative" style={{ backgroundColor: nardoGray }}>
      <Canvas
        shadows={false}
        camera={{ position: [0, 5, -90], fov: 45, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: false }}
        className="w-full h-full"
        style={{ background: nardoGray }}
      >
        <Suspense fallback={null}>
          <Environment />
          <Lighting />
          <CameraController zoom={zoom} onCameraPositionChange={handleCameraPositionChange} />
          <ModelGrid />
        </Suspense>
      </Canvas>
      
      {/* Hero Section Overlay */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-500"
        style={{ opacity: heroOpacity }}
      >
        <div className="h-full p-8 pt-20 relative overflow-hidden">
          {/* Background accent elements */}
          <div className="absolute top-40 right-40 w-64 h-64 bg-accent-cyan rounded-full opacity-20 blur-xl"></div>
          <div className="absolute bottom-40 left-10 w-24 h-24 bg-accent-grey rounded-full opacity-15 blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-accent-white rounded-full opacity-10 blur-lg"></div>
          
          <div className="flex items-end justify-start relative z-10 pb-80 md:pb-20 h-full">
            <div className="flex flex-col items-start justify-start">
              <span className="text-accent-white text-4xl md:text-8xl whitespace-normal md:whitespace-nowrap font-medium">Hi, I&apos;m&nbsp;</span>
              <h1 className="text-accent-cyanLight text-4xl md:text-8xl leading-tight whitespace-normal md:whitespace-nowrap font-semibold">
                <AnimatedTitle />
              </h1>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <Footer />
      </div>
    </div>
  );
}
