import React from 'react';

interface FolderTransitionProps {
  isTransitioning: boolean;
  clickPosition: { x: number; y: number } | null;
  children: React.ReactNode;
  className?: string;
}

export default function FolderTransition({ 
  isTransitioning, 
  clickPosition, 
  children, 
  className = "" 
}: FolderTransitionProps) {
  const transformOrigin = clickPosition 
    ? `${clickPosition.x}px ${clickPosition.y}px`
    : 'center center';

  return (
    <div 
      className={`transition-all duration-200 ease-out overflow-hidden ${className}`}
      style={{ 
        transformOrigin,
        transform: isTransitioning ? 'scale(0.05)' : 'scale(1)',
        opacity: isTransitioning ? 0 : 1
      }}
    >
      {children}
    </div>
  );
}
