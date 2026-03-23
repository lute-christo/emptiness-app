"use client";

import { useEffect } from "react";

interface ShrineCompletionToastProps {
  shrineName: string;
  shrineColor: string;
  onClose: () => void;
}

export default function ShrineCompletionToast({
  shrineName,
  shrineColor,
  onClose,
}: ShrineCompletionToastProps) {
  useEffect(() => {
    const id = setTimeout(onClose, 4500);
    return () => clearTimeout(id);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center pb-8 px-4 pointer-events-none">
      <div
        className="pointer-events-auto w-full max-w-sm rounded-2xl bg-[#0d0a07]/95 backdrop-blur-sm px-5 py-3.5 flex items-center gap-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        style={{ border: `1px solid ${shrineColor}30` }}
      >
        <div
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm"
          style={{ background: `${shrineColor}12`, border: `1px solid ${shrineColor}35` }}
        >
          ✦
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium" style={{ color: `${shrineColor}cc` }}>
            {shrineName} — complete
          </p>
          <p className="text-[11px] text-[#f5e6c8]/30 mt-0.5">
            The mandala of this ling is full.
          </p>
        </div>
      </div>
    </div>
  );
}
