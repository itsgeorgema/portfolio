"use client";
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useMemo } from 'react';
import * as THREE from 'three';
import { processMaterials } from './ModelUtils';

export default function ChessModel({ position }: { position: [number, number, number] }) {
  const gltf = useLoader(GLTFLoader, '/models/chess.glb');
  
  const individualChessPieces = useMemo(() => {
    const extractionLogic = (clonedScene: THREE.Group) => {
      const chessPieces: THREE.Group[] = [];
      
      // First try to find RootNode structure
      let foundPieces = false;
      clonedScene.traverse((child) => {
        if (child.name === 'RootNode') {
          child.children.forEach((chessObject) => {
            if (chessObject.name === 'Board') {
              // Add the board as a single object
              const boardGroup = new THREE.Group();
              const boardClone = chessObject.clone();
              boardGroup.add(boardClone);
              chessPieces.push(boardGroup);
              foundPieces = true;
            } else if (chessObject.name === 'Black Pieces' || chessObject.name === 'White Pieces') {
              // Add each individual piece from the Black Pieces and White Pieces groups
              chessObject.children.forEach((piece) => {
                const pieceGroup = new THREE.Group();
                const pieceClone = piece.clone();
                pieceGroup.add(pieceClone);
                chessPieces.push(pieceGroup);
              });
              foundPieces = true;
            } else {
              // If it's another type of object, add it individually
              const pieceGroup = new THREE.Group();
              const pieceClone = chessObject.clone();
              pieceGroup.add(pieceClone);
              chessPieces.push(pieceGroup);
              foundPieces = true;
            }
          });
        }
      });
      
      // If no RootNode structure found, try direct children approach (like BarricadeSet fallback)
      if (!foundPieces) {
        clonedScene.children.forEach((child) => {
          const pieceGroup = new THREE.Group();
          const pieceClone = child.clone();
          pieceGroup.add(pieceClone);
          chessPieces.push(pieceGroup);
        });
      }
      
      return chessPieces;
    };
    
    // Custom processing for chess with extremely small scale
    const clonedScene = gltf.scene.clone();
    const chessPieces = extractionLogic(clonedScene);
    
    // Process materials for all chess piece groups
    chessPieces.forEach(pieceGroup => {
      processMaterials(pieceGroup);
    });
    
    // Calculate scaling based on the full scene
    const fullBox = new THREE.Box3().setFromObject(clonedScene);
    const fullSize = fullBox.getSize(new THREE.Vector3());
    const maxDimension = Math.max(fullSize.x, fullSize.y, fullSize.z);
    
    if (maxDimension > 0) {
      // Use an extremely small scale for chess to prevent oversizing
      const scale = 0.1 / maxDimension;
      
      // Apply same scaling to all chess piece groups
      chessPieces.forEach(pieceGroup => {
        pieceGroup.scale.setScalar(scale);
      });
      
      // Position all chess pieces to maintain their relative positions
      const center = fullBox.getCenter(new THREE.Vector3());
      center.multiplyScalar(scale);
      
      chessPieces.forEach(pieceGroup => {
        pieceGroup.position.set(-center.x, -fullBox.min.y * scale, -center.z);
      });
    }
    
    return chessPieces;
  }, [gltf.scene]);

  return (
    <group position={position}>
      {/* Render each individual chess piece and board */}
      {individualChessPieces.map((pieceGroup, index) => (
        <primitive key={`chess-${index}`} object={pieceGroup} />
      ))}
    </group>
  );
}
