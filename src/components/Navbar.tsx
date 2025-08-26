"use client";
import Link from "next/link";
import { useModal } from "./ModalContext";
import { triggerCarReset } from "./3D/CarResetStore";

export default function Navbar() {
  const { openAbout, openGallery, openProjects } = useModal();

  // Prevent mouse interactions from moving focus to nav items
  const preventMouseFocus: React.MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault();
  };

  const handleHomeClick = () => {
    triggerCarReset();
  };

  return (
    <div className="fixed top-10 right-15 z-50 text-lg">
      <nav className="flex gap-4 justify-end text-accent-white font-oxanium">
        <button onMouseDown={preventMouseFocus} onClick={handleHomeClick}>
          <span className="underline-animation cursor-pointer">HOME</span>
        </button>
        <button onMouseDown={preventMouseFocus} onClick={openAbout}>
          <span className="underline-animation cursor-pointer">ABOUT</span>
        </button>
        <button onMouseDown={preventMouseFocus} onClick={openGallery}>
          <span className="underline-animation cursor-pointer">GALLERY</span>
        </button>
        <button onMouseDown={preventMouseFocus} onClick={openProjects}>
          <span className="underline-animation cursor-pointer">PROJECTS</span>
        </button>
        <Link href="/George_Ma_Resume.pdf" target="_blank" onMouseDown={preventMouseFocus}>
          <span className="underline-animation cursor-pointer">RESUME</span>
        </Link>
      </nav>
    </div>
  );
}
