"use client";
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { nardoGrayColors } from '@/styles/colors';

export default function Environment() {
  const { scene } = useThree();
  const nardoGray = nardoGrayColors.primary[500];

  useEffect(() => {
    scene.background = null;
  }, [scene, nardoGray]);

  return (
    <>
    </>
  );
}
