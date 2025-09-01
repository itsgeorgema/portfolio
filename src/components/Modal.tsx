"use client";
import { motion, AnimatePresence } from "framer-motion";
import { nardoGrayColors } from "@/styles/colors";
import CloseButton from "./CloseButton";

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
  const handleClose = () => {
    if (onReset) {
      onReset();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
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
          <motion.div 
            className="relative rounded-lg shadow-2xl p-8 max-w-6xl w-full mx-4 h-[90vh] flex flex-col"
            style={{ backgroundColor: backgroundColor ?? nardoGrayColors.primary[600] }}
            initial={{ opacity: 0, y: 48, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 48, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <CloseButton onClick={handleClose} />
            
            {/* Title */}
            <h2 className={`text-2xl font-bold mb-8 font-orbitron text-center ${titleClassName ?? 'text-white'}`}>
              {title.toUpperCase()}
            </h2>
            
            {/* Content */}
            <div className="flex-1 min-h-0">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
