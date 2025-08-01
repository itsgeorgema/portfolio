import Link from "next/link";

export default function Navbar() {
  return (
    <div className="fixed top-10 right-15 z-50">
      <nav className="flex gap-4 justify-end text-accent-white">
        <Link href="/" className="hover:text-accent-cyan transition-colors duration-200">Home</Link>
        <Link href="/about" className="hover:text-accent-cyan transition-colors duration-200">About</Link>
      </nav>
    </div>
  );
}
