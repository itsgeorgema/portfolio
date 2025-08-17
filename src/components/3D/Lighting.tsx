"use client";

export default function Lighting() {
  return (
    <>
      {/* Balanced ambient light to preserve texture colors */}
      <ambientLight
        intensity={0.5}
        color="#ffffff"
      />
      
      {/* Main directional light for proper shading */}
      <directionalLight
        position={[10, 15, 10]}
        intensity={0.7}
        color="#ffffff"
        castShadow={false}
      />
      
      {/* Fill light to prevent harsh shadows */}
      <directionalLight
        position={[-5, 10, -5]}
        intensity={0.3}
        color="#ffffff"
        castShadow={false}
      />
    </>
  );
}
