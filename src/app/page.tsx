"use client";

import Navbar from "@/components/Navbar";
import AnimatedTitle from "@/components/AnimatedTitle";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-blue-500">
      <Navbar />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">George Ma</h1>
        <div className="flex flex-row gap-1">
          <p>Hi, I&apos;m</p>
            <AnimatedTitle />
        </div>
      </main>
    </div>
  );
}
