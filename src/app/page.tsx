"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import Scene3D from "@/components/3D/Scene3D";
import ErrorBoundary from "@/components/3D/ErrorBoundary";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give enough time for both landing page and 3D scene to mount
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds should be enough for everything to load

    return () => clearTimeout(timer);
  }, []);

  return isLoading ? (
    <div className="flex items-center justify-center h-screen bg-[#92a6b0]">
      <div className="text-center">
        <LoadingSpinner size="lg" color="accent-charcoal" />
        <p className="mt-4 text-accent-white text-lg">Loading Portfolio...</p>
      </div>
    </div>
  ) : (
    <div className="relative">
      {/* 3D Scene Section with integrated hero */}
      <div className="relative">
        <ErrorBoundary>
          <Scene3D />
        </ErrorBoundary>
      </div>
    </div>
  );
}
