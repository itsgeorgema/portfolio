"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import Scene3D from "@/components/3D/Scene3D";
import { PhysicsProvider } from "@/components/3D/PhysicsProvider";
import ErrorBoundary from "@/components/3D/ErrorBoundary";
import AboutModal from "@/components/modals/AboutModal";
import ProjectsModal from "@/components/modals/ProjectsModal";
import { useModal } from "@/components/ModalContext";
import { useEffect, useState } from "react";
import { nardoGrayColors } from "@/styles/colors";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { 
    isAboutOpen, 
    isProjectsOpen, 
    closeAbout, 
    closeProjects 
  } = useModal();

  useEffect(() => {
    // Give enough time for both landing page and 3D scene to mount
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds should be enough for everything to load

    return () => clearTimeout(timer);
  }, []);

  return isLoading ? (
    <div 
      className="flex items-center justify-center h-screen"
      style={{ backgroundColor: nardoGrayColors.primary[500] }}
    >
      <div className="text-center">
        <LoadingSpinner size="lg" color="accent-charcoal" />
        <p className="mt-4 text-accent-white text-lg">Loading Portfolio...</p>
      </div>
    </div>
  ) : (
    <div className="relative">
      {/* 3D Scene Section with integrated hero */}
      <div className="relative">
        <PhysicsProvider>
          <ErrorBoundary>
            <Scene3D />
          </ErrorBoundary>
        </PhysicsProvider>
      </div>

      {/* Modals */}
      <AboutModal isOpen={isAboutOpen} onClose={closeAbout} />
      <ProjectsModal isOpen={isProjectsOpen} onClose={closeProjects} />
    </div>
  );
}
