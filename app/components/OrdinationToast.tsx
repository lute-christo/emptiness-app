"use client";

import { useEffect } from "react";
import { SPINNER_TIERS } from "../data/gameData";

interface OrdinationToastProps {
  tierId: string;
  onClose: () => void;
}

export default function OrdinationToast({ tierId, onClose }: OrdinationToastProps) {
  const tier = SPINNER_TIERS.find((t) => t.id === tierId);

  useEffect(() => {
    const id = setTimeout(onClose, 3500);
    return () => clearTimeout(id);
  }, [onClose]);

  if (!tier) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center pb-8 px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-sm rounded-2xl border border-[#f5e6c8]/8 bg-[#0d0a07]/95 backdrop-blur-sm px-5 py-3.5 flex items-center gap-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <div className="shrink-0 w-8 h-8 rounded-full border border-[#f5e6c8]/15 bg-white/5 flex items-center justify-center text-sm">
          {tier.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[#f5e6c8]/70">Empowerment given</p>
          <p className="text-[10px] text-[#f5e6c8]/30">
            The {tier.name} lineage deepens.
          </p>
        </div>
      </div>
    </div>
  );
}
