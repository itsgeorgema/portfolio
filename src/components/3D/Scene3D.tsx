"use client";
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState, useRef } from 'react';
import ModelGrid from './ModelGrid';
import CameraController from './CameraController';
import Lighting from './Lighting';
import Environment from './Environment';
import { nardoGrayColors } from '@/styles/colors';

export default function Scene3D() {
  const [zoom, setZoom] = useState(1);
  const [targetZoom, setTargetZoom] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);
  const nardoGray = nardoGrayColors.primary[500]; // Use exact color from color system

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const handleWheel = (event: WheelEvent) => {
      // Only prevent default and handle zoom when the mouse is over the 3D canvas
      event.preventDefault();
      const zoomSpeed = 0.08; // Increased sensitivity from 0.05 to 0.08
      const newZoom = targetZoom + (event.deltaY > 0 ? zoomSpeed : -zoomSpeed);
      setTargetZoom(Math.max(0.8, Math.min(4, newZoom))); // Increased max zoom in from 3 to 4
    };

    // Add wheel event listener only to the canvas container
    canvasElement.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvasElement.removeEventListener('wheel', handleWheel);
  }, [targetZoom]);

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
        camera={{ position: [20, 20, 20], fov: 45, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: false }}
        className="w-full h-full"
        style={{ background: nardoGray }}
      >
        <Suspense fallback={null}>
          <Environment />
          <Lighting />
          <CameraController zoom={zoom} />
          <ModelGrid />
        </Suspense>
      </Canvas>
    </div>
  );
}
