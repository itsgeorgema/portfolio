"use client";
import { useState } from "react";
import Modal from "../Modal";
import BackButton from "../BackButton";
import { nardoGrayColors } from "@/styles/colors";
import FolderGrid from "../FolderGrid";
import FolderTransition from "../animations/FolderTransition";

interface ScrapbookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FolderName = "ME" | "FRIENDS" | "SHENANIGANS" | "THE GREAT OUTDOORS" | "MISCELLANEOUS" | "VIEWS" | "MAJOR EVENTS";

interface Folder {
  name: FolderName;
  displayName: string;
}

const folders: Folder[] = [
  { name: "ME", displayName: "ME" },
  { name: "FRIENDS", displayName: "FRIENDS" },
  { name: "SHENANIGANS", displayName: "SHENANIGANS" },
  { name: "THE GREAT OUTDOORS", displayName: "THE GREAT OUTDOORS" },
  { name: "VIEWS", displayName: "VIEWS" },
  { name: "MAJOR EVENTS", displayName: "MAJOR EVENTS" },
  { name: "MISCELLANEOUS", displayName: "MISCELLANEOUS" },
];

export default function ScrapbookModal({ isOpen, onClose }: ScrapbookModalProps) {
  const [currentFolder, setCurrentFolder] = useState<FolderName | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);

  const handleFolderClick = (folder: FolderName, event: React.MouseEvent<HTMLDivElement>) => {
    // Get the position of the clicked folder for the transition origin
    const rect = event.currentTarget.getBoundingClientRect();
    const modalContainer = document.querySelector('.modal-container');
    const modalRect = modalContainer?.getBoundingClientRect();
    
    if (modalRect) {
      // Calculate the center point of the folder relative to the modal
      const folderCenterX = rect.left + rect.width / 2 - modalRect.left;
      const folderCenterY = rect.top + rect.height / 2 - modalRect.top;
      
      setClickPosition({
        x: folderCenterX,
        y: folderCenterY,
      });
    }
    
    // Start the transition immediately
    setIsTransitioning(true);
    
    // Smooth transition: fade out folders, then show content
    setTimeout(() => {
      setCurrentFolder(folder);
      // Keep transitioning state for content animation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100); // Content fade-in duration
    }, 150); // Folder fade-out duration
  };

  const handleBackClick = () => {
    // Start the reverse transition immediately
    setIsTransitioning(true);
    
    // Smooth reverse transition: fade out content, then show folders
    setTimeout(() => {
      setCurrentFolder(null);
      setClickPosition(null);
      // Keep transitioning state for folder animation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100); // Folder fade-in duration
    }, 100); // Content fade-out duration
  };

  // Reset to main scrapbook view when modal is closed and reopened
  const handleReset = () => {
    setCurrentFolder(null);
    setClickPosition(null);
    setIsTransitioning(false);
  };

  const getModalTitle = () => {
    if (currentFolder) {
      return `/SCRAPBOOK/${currentFolder}`;
    }
    return "/SCRAPBOOK";
  };

  const renderFolderGrid = () => {
    return (
      <FolderGrid
        folders={folders}
        onFolderClick={handleFolderClick}
        isTransitioning={isTransitioning}
      />
    );
  };

  const renderFolderContent = () => {

    return (
              <FolderTransition
          isTransitioning={isTransitioning}
          clickPosition={clickPosition}
          className="flex-1 flex flex-col"
        >
          {/* Folder content area - scrollable */}
          <div className="flex-1 flex flex-col overflow-y-auto pr-2 scrollbar-default min-h-0">
            {/* TODO: This is where folder content (images/videos) will be rendered */}
            {/* For now, showing empty state as fallback */}
            
            {/* Empty state fallback */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4" style={{ color: nardoGrayColors.accent.charcoal }}>
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-white text-lg font-medium">NO CONTENT AVAILABLE</p>
                <p className="text-gray-400 text-sm mt-2">This folder is currently empty</p>
              </div>
            </div>
          </div>
        </FolderTransition>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getModalTitle()} onReset={handleReset}>
      {currentFolder && <BackButton onClick={handleBackClick} />}
      <div className="modal-container modal-content flex-1 flex flex-col min-h-0">
        {currentFolder ? renderFolderContent() : renderFolderGrid()}
      </div>
    </Modal>
  );
}
