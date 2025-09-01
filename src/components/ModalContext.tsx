"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
  isAboutOpen: boolean;
  isScrapbookOpen: boolean;
  isProjectsOpen: boolean;
  openAbout: () => void;
  openScrapbook: () => void;
  openProjects: () => void;
  closeAbout: () => void;
  closeScrapbook: () => void;
  closeProjects: () => void;
  closeAll: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isScrapbookOpen, setIsScrapbookOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

  const openAbout = () => setIsAboutOpen(true);
  const openScrapbook = () => setIsScrapbookOpen(true);
  const openProjects = () => setIsProjectsOpen(true);

  const closeAbout = () => setIsAboutOpen(false);
  const closeScrapbook = () => setIsScrapbookOpen(false);
  const closeProjects = () => setIsProjectsOpen(false);

  const closeAll = () => {
    setIsAboutOpen(false);
    setIsScrapbookOpen(false);
    setIsProjectsOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{
        isAboutOpen,
        isScrapbookOpen,
        isProjectsOpen,
        openAbout,
        openScrapbook,
        openProjects,
        closeAbout,
        closeScrapbook,
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
