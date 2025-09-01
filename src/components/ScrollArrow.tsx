"use client";

interface ScrollArrowProps {
  onClick?: () => void;
  className?: string;
  targetSelector?: string;
}

export default function ScrollArrow({ onClick, className = "", targetSelector }: ScrollArrowProps) {
  const handleClick = () => {
    if (onClick) {
      // Use custom onClick if provided
      onClick();
    } else if (targetSelector) {
      // Use targetSelector if provided
      const target = document.querySelector(targetSelector);
      if (target) {
        // Add slow scroll CSS temporarily
        const style = document.createElement('style');
        style.textContent = `
          html { scroll-behavior: smooth; }
          * { scroll-behavior: smooth !important; }
        `;
        document.head.appendChild(style);
        
        // Use smooth scroll
        target.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
        
        // Remove the style after scroll completes
        setTimeout(() => {
          document.head.removeChild(style);
        }, 1000);
      }
    } else {
      // Default behavior: scroll down by one viewport height
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-bounce">
      <button
        onClick={handleClick}
        aria-label="Scroll down"
        className={`focus:outline-none cursor-pointer group ${className}`}
      >
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2" className="transition-colors duration-200 group-hover:stroke-accent-cyanLight">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}
