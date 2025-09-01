"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { nardoGrayColors } from "@/styles/colors";
import CloseButton from "./CloseButton";
import SlideOutFadeOut from "./animations/SlideOutFadeOut";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  backgroundColor?: string;
  titleClassName?: string;
  onReset?: () => void;
}

export default function Modal({ isOpen, onClose, title, children, backgroundColor, titleClassName, onReset }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    if (onReset) {
      onReset();
    }
    onClose();
  };

  // Disable page scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" ref={overlayRef}>
          {/* Backdrop - blurred/faded overlay */}
          <motion.div 
            className="absolute inset-0 backdrop-blur-sm bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
          />
          
          {/* Modal */}
          <SlideOutFadeOut direction="up" distance={48} duration={0.4}>
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              tabIndex={-1}
              ref={panelRef}
              className="relative rounded-lg shadow-2xl p-8 mx-4 h-[90vh] flex flex-col w-[72rem]"
              onKeyDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              style={{ backgroundColor: backgroundColor ?? nardoGrayColors.primary[600] }}
            >
            <CloseButton onClick={handleClose} />
            
            {/* Title */}
            <h2 id="modal-title" className={`text-2xl font-bold mb-8 font-orbitron text-center ${titleClassName ?? 'text-white'}`}>
              {title.toUpperCase()}
            </h2>
            
            {/* Content */}
            <div className="flex-1 min-h-0">
              {children}
            </div>
            </div>
          </SlideOutFadeOut>
        </div>
      )}
    </AnimatePresence>
  );
}
