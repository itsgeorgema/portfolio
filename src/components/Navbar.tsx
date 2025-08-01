import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center p-4 w-full">
      <div className="text-2xl font-bold">George Ma</div>
      <div className="flex gap-4 justify-end">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
      </div>
    </div>
  );
}
