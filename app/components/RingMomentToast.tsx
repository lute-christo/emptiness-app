"use client";

import { useEffect, useState } from "react";
import type { Teaching } from "../data/gameData";

interface RingMomentToastProps {
  teaching: Teaching;
  onClose: () => void;
}

export default function RingMomentToast({ teaching, onClose }: RingMomentToastProps) {
  const duration = teaching.autoDismissMs ?? 4000;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 1 - elapsed / duration);
      setProgress(remaining * 100);
      if (remaining === 0) {
        clearInterval(interval);
        onClose();
      }
    }, 50);
    return () => clearInterval(interval);
  }, [duration, onClose]);

  return (
    <div className="fixed top-16 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <div className="w-full max-w-sm rounded-xl border border-[#c9a227]/20 bg-[#0d0a07]/90 backdrop-blur-sm overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="px-4 py-3">
          <p className="text-[10px] uppercase tracking-widest text-[#c9a227]/40 mb-0.5">
            {teaching.title}
          </p>
          <p className="text-xs text-[#f5e6c8]/55 leading-relaxed">{teaching.body}</p>
        </div>
        <div className="h-px bg-white/5">
          <div
            className="h-full bg-[#c9a227]/40 transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
