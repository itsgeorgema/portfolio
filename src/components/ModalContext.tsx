"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
  isAboutOpen: boolean;
  isProjectsOpen: boolean;
  openAbout: () => void;
  openProjects: () => void;
  closeAbout: () => void;
  closeProjects: () => void;
  closeAll: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

  const openAbout = () => setIsAboutOpen(true);
  const openProjects = () => setIsProjectsOpen(true);

  const closeAbout = () => setIsAboutOpen(false);
  const closeProjects = () => setIsProjectsOpen(false);

  const closeAll = () => {
    setIsAboutOpen(false);
    setIsProjectsOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{
        isAboutOpen,
        isProjectsOpen,
        openAbout,
        openProjects,
        closeAbout,
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
