interface FolderIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function FolderIcon({ className = "", width = 96, height = 80 }: FolderIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 96 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main folder body */}
      <path
        d="M12 20C12 17.7909 13.7909 16 16 16H36.5858C37.1162 16 37.6249 16.2107 38 16.5858L45.4142 24H84C86.2091 24 88 25.7909 88 28V64C88 66.2091 86.2091 68 84 68H16C13.7909 68 12 66.2091 12 64V20Z"
        fill="url(#folderGradient)"
        stroke="url(#folderBorder)"
        strokeWidth="1.5"
      />
      
      {/* Folder tab */}
      <path
        d="M12 20C12 17.7909 13.7909 16 16 16H36.5858C37.1162 16 37.6249 16.2107 38 16.5858L45.4142 24H12V20Z"
        fill="url(#tabGradient)"
        stroke="url(#folderBorder)"
        strokeWidth="1.5"
      />
      
      <defs>
        {/* Main folder gradient - Cyan */}
        <linearGradient id="folderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4dd0e1" />
          <stop offset="100%" stopColor="#00bcd4" />
        </linearGradient>
        
        {/* Tab gradient - Light cyan */}
        <linearGradient id="tabGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#80deea" />
          <stop offset="100%" stopColor="#4dd0e1" />
        </linearGradient>
        
        {/* Border gradient - Dark cyan */}
        <linearGradient id="folderBorder" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0097a7" />
          <stop offset="100%" stopColor="#00838f" />
        </linearGradient>
      </defs>
    </svg>
  );
}
