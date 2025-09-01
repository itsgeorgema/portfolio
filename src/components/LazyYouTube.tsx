"use client";
import { useState, useEffect } from "react";

interface LazyYouTubeProps {
  videoUrl: string;
  title: string;
  className?: string;
  delay?: number; // Delay in milliseconds before loading
}

export default function LazyYouTube({ videoUrl, title, className = "", delay = 200 }: LazyYouTubeProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Extract video ID from YouTube URL
  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  };

  const videoId = getVideoId(videoUrl);
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  // Auto-load video after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (isLoaded) {
    return (
      <div className={`aspect-video w-full ${className}`}>
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full rounded-lg"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    );
  }

  return (
    <div className={`aspect-video w-full bg-gray-800 rounded-lg flex items-center justify-center ${className}`}>
      <div className="text-gray-400 text-sm">Loading video...</div>
    </div>
  );
}
