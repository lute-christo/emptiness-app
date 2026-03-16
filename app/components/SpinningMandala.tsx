"use client";

import { useRef, useEffect } from "react";
import Mandala from "./Mandala";

interface SpinningMandalaProps {
  level: number;
  className?: string;
  speed?: number; // radians per second
  name?: string;
}

export default function SpinningMandala({
  level,
  className = "",
  speed = 0.25,
  name,
}: SpinningMandalaProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Start at a random angle so companions don't all face the same way
  const rotation = useRef(Math.random() * Math.PI * 2);

  useEffect(() => {
    let animId: number;
    let lastFrame = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;
      rotation.current += speed * dt;
      if (ref.current) {
        ref.current.style.transform = `rotate(${rotation.current}rad)`;
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div className="flex flex-col items-center gap-1">
      <div ref={ref} style={{ willChange: "transform" }}>
        <Mandala level={level} className={className} />
      </div>
      {name && (
        <span className="text-[8px] text-[#f5e6c8]/20 tracking-widest uppercase">
          {name}
        </span>
      )}
    </div>
  );
}
