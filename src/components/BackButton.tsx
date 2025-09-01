interface BackButtonProps {
  onClick: () => void;
  className?: string;
}

export default function BackButton({ onClick, className = "" }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      tabIndex={-1}
      className={`absolute top-4 left-4 flex items-center space-x-2 text-white hover:text-accent-cyanLight transition-colors duration-200 group cursor-pointer ${className}`}
    >
      <svg 
        className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span className="font-medium">Back</span>
    </button>
  );
}
