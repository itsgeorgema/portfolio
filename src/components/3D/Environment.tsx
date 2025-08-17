"use client";
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { nardoGrayColors } from '@/styles/colors';

export default function Environment() {
  const { scene } = useThree();
  const nardoGray = nardoGrayColors.primary[500];

  useEffect(() => {
    scene.background = new THREE.Color(nardoGray);
  }, [scene, nardoGray]);

  return (
    <>
      {/* Much larger infinite ground plane/terrain */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10000, 10000]} />
        <meshBasicMaterial color={nardoGray} />
      </mesh>
      
      {/* Extended fog for much larger terrain */}
      <fog attach="fog" args={[nardoGray, 300, 1500]} />
    </>
  );
}
