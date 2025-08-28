"use client";
import { useEffect, useState } from "react";
import { nardoGrayColors } from "@/styles/colors";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  backgroundColor?: string;
  titleClassName?: string;
}

export default function Modal({ isOpen, onClose, title, children, backgroundColor, titleClassName }: ModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 400); // Increased to match longer transition duration
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop - blurred/faded overlay */}
      <div 
        className="absolute inset-0 backdrop-blur-sm bg-black/50 transition-all duration-500 ease-out"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative rounded-lg shadow-2xl p-8 max-w-6xl w-full mx-4 h-[90vh] flex flex-col transform transition-all duration-500 ease-out ${
          isAnimating 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-12 opacity-0 scale-95'
        }`}
        style={{ backgroundColor: backgroundColor ?? nardoGrayColors.primary[500] }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-accent-cyanLight transition-colors duration-200 cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Title */}
        <h2 className={`text-2xl font-bold mb-4 font-orbitron text-center ${titleClassName ?? 'text-white'}`}>
          {title.toUpperCase()}
        </h2>
        
        {/* Content */}
        <div className="flex-1 min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
}
