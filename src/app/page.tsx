"use client";
import AnimatedTitle from "@/components/AnimatedTitle";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      setIsLoading(false);
  }, []);

  return isLoading ? (
    <div className="flex items-center justify-center h-screen"
    >
      <LoadingSpinner size="lg" color="accent-charcoal" />
    </div>
  ) : (
    <div className="h-full p-8 pt-20 relative overflow-hidden bg-cover bg-center bg-no-repeat"
    >
      {/* Background accent elements */}
      <div className="absolute top-40 right-40 w-64 h-64 bg-accent-cyan rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-40 left-10 w-24 h-24 bg-accent-grey rounded-full opacity-15 blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-accent-white rounded-full opacity-10 blur-lg"></div>
      
      <div className="flex items-end justify-start relative z-10 pb-80 md:pb-20 h-full">
        <div className="flex flex-col items-start justify-start">
          <span className="text-accent-white text-4xl md:text-8xl whitespace-normal md:whitespace-nowrap font-medium">Hi, I&apos;m&nbsp;</span>
          <h1 className={`text-accent-cyanLight text-4xl md:text-8xl leading-tight whitespace-normal md:whitespace-nowrap font-semibold`}>
            <AnimatedTitle />
          </h1>
        </div>
      </div>
    </div>
  );
}
