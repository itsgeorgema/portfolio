"use client";

export default function CarControlsOverlay() {
  return (
    <div className="absolute right-6 lg:pr-35 pb-20 top-1/2 -translate-y-1/2 z-30 text-white text-sm max-w-xs select-none">
      <h3 className="font-semibold mb-2 opacity-90">Car Controls</h3>
      <div className="space-y-1 opacity-90">
        <div><kbd className="bg-gray-600/50 px-2 py-1 rounded text-xs">W</kbd> or <kbd className="bg-gray-600/50 px-2 py-1 rounded text-xs">↑</kbd> - Forward</div>
        <div><kbd className="bg-gray-600/50 px-2 py-1 rounded text-xs">S</kbd> or <kbd className="bg-gray-600/50 px-2 py-1 rounded text-xs">↓</kbd> - Backward</div>
        <div><kbd className="bg-gray-600/50 px-2 py-1 rounded text-xs">A</kbd> or <kbd className="bg-gray-600/50 px-2 py-1 rounded text-xs">←</kbd> - Turn Left</div>
        <div><kbd className="bg-gray-600/50 px-2 py-1 rounded text-xs">D</kbd> or <kbd className="bg-gray-600/50 px-2 py-1 rounded text-xs">→</kbd> - Turn Right</div>
        <div><kbd className="bg-gray-600/50 px-2 py-1 rounded text-xs">Shift</kbd> - Brake</div>
        <div><kbd className="bg-gray-600/50 px-2 py-1 rounded text-xs">R</kbd> - Reset Position</div>
      </div>
    </div>
  );
}
