import React from 'react';
import FolderIcon from './icons/FolderIcon';

interface Folder<T extends string = string> {
  name: T;
  displayName: string;
}

interface FolderGridProps<T extends string = string> {
  folders: Folder<T>[];
  onFolderClick: (folderName: T, event: React.MouseEvent<HTMLDivElement>) => void;
  isTransitioning: boolean;
  className?: string;
}

export default function FolderGrid<T extends string = string>({ 
  folders, 
  onFolderClick, 
  isTransitioning, 
  className = "" 
}: FolderGridProps<T>) {
  return (
    <div 
      className={`transition-all duration-200 ease-out overflow-y-auto scrollbar-default ${
        isTransitioning ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
      } ${className}`}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-8 min-h-0">
        {folders.map((folder) => (
          <div 
            key={folder.name} 
            onClick={(e) => onFolderClick(folder.name, e)}
            className="flex flex-col items-center space-y-3 cursor-pointer group transition-transform duration-200 hover:scale-105"
          >
            <div className="transition-all duration-200 group-hover:brightness-110">
              <FolderIcon width={96} height={80} />
            </div>
            <span className="text-white text-sm font-medium text-center max-w-[120px] leading-tight group-hover:text-accent-cyanLight transition-colors duration-200">
              {folder.displayName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

