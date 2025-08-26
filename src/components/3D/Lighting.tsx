"use client";

export default function Lighting() {
  return (
    <>
      {/* Much higher ambient light for very light overall shading */}
      <ambientLight
        intensity={1.2}
        color="#ffffff"
      />
      
      {/* Further reduced main directional light for very soft shadows */}
      <directionalLight
        position={[10, 15, 10]}
        intensity={0.3}
        color="#ffffff"
        castShadow={false}
      />
      
      {/* Higher fill light to create very even illumination */}
      <directionalLight
        position={[-5, 10, -5]}
        intensity={0.7}
        color="#ffffff"
        castShadow={false}
      />
    </>
  );
}
