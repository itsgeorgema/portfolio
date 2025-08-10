import Link from "next/link";

export default function Navbar() {
  return (
    <div className="fixed top-10 right-15 z-50 text-lg">
      <nav className="flex gap-4 justify-end text-accent-white font-oxanium">
        <Link href="/">
        <span className="underline-animation">HOME</span></Link>
        <Link href="/about">
        <span className="underline-animation">ABOUT</span></Link>
        <Link href="/gallery">
        <span className="underline-animation">GALLERY</span></Link>
        <Link href="/projects">
        <span className="underline-animation">PROJECTS</span></Link>
        <Link href="/George_Ma_Resume.pdf" target="_blank">
        <span className="underline-animation">RESUME</span></Link>
      </nav>
    </div>
  );
}
