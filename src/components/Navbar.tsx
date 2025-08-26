"use client";
import Link from "next/link";
import { useModal } from "./ModalContext";
import { triggerCarReset } from "./3D/CarResetStore";

export default function Navbar() {
  const { openAbout, openGallery, openProjects } = useModal();

  const handleHomeClick = () => {
    triggerCarReset();
  };

  return (
    <div className="fixed top-10 right-15 z-50 text-lg">
      <nav className="flex gap-4 justify-end text-accent-white font-oxanium">
        <button onClick={handleHomeClick}>
          <span className="underline-animation cursor-pointer">HOME</span>
        </button>
        <button onClick={openAbout}>
          <span className="underline-animation cursor-pointer">ABOUT</span>
        </button>
        <button onClick={openGallery}>
          <span className="underline-animation cursor-pointer">GALLERY</span>
        </button>
        <button onClick={openProjects}>
          <span className="underline-animation cursor-pointer">PROJECTS</span>
        </button>
        <Link href="/George_Ma_Resume.pdf" target="_blank">
          <span className="underline-animation cursor-pointer">RESUME</span>
        </Link>
      </nav>
    </div>
  );
}
