"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
  isAboutOpen: boolean;
  isGalleryOpen: boolean;
  isProjectsOpen: boolean;
  openAbout: () => void;
  openGallery: () => void;
  openProjects: () => void;
  closeAbout: () => void;
  closeGallery: () => void;
  closeProjects: () => void;
  closeAll: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

  const openAbout = () => setIsAboutOpen(true);
  const openGallery = () => setIsGalleryOpen(true);
  const openProjects = () => setIsProjectsOpen(true);

  const closeAbout = () => setIsAboutOpen(false);
  const closeGallery = () => setIsGalleryOpen(false);
  const closeProjects = () => setIsProjectsOpen(false);

  const closeAll = () => {
    setIsAboutOpen(false);
    setIsGalleryOpen(false);
    setIsProjectsOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{
        isAboutOpen,
        isGalleryOpen,
        isProjectsOpen,
        openAbout,
        openGallery,
        openProjects,
        closeAbout,
        closeGallery,
        closeProjects,
        closeAll,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
