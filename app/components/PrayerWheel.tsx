"use client";

import React, { useRef, useEffect, useCallback } from "react";
import Mandala from "./Mandala";

interface PrayerWheelProps {
  level: number;
  onRevolution: () => void;
  className?: string;
  mantraProgress?: number;
  paused?: boolean;
  velocityRef?: React.MutableRefObject<number>;
}

const TAU = Math.PI * 2;

const IDLE_VELOCITY = 0.08;
const DECAY_RATE = 0.15;
const MAX_VELOCITY = 15;

export default function PrayerWheel({ level, onRevolution, className = "w-72 h-72 md:w-80 md:h-80", mantraProgress = 0, paused = false, velocityRef }: PrayerWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotation = useRef(0);
  const velocity = useRef(IDLE_VELOCITY);
  const isDragging = useRef(false);
  const isCWDragging = useRef(false); // true only during active clockwise movement
  const lastAngle = useRef(0);
  const lastMoveTime = useRef(0);

  const accumulatedCW = useRef(0);
  const lastRevCount = useRef(0);

  const onRevolutionRef = useRef(onRevolution);
  onRevolutionRef.current = onRevolution;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const checkRevolutions = useCallback((addedRadians: number) => {
    accumulatedCW.current += addedRadians;
    const totalRevs = Math.floor(accumulatedCW.current / TAU);
    const newRevs = totalRevs - lastRevCount.current;
    for (let i = 0; i < newRevs; i++) {
      onRevolutionRef.current();
    }
    lastRevCount.current = totalRevs;
  }, []);

  const getAngle = useCallback((clientX: number, clientY: number): number => {
    const rect = containerRef.current!.getBoundingClientRect();
    return Math.atan2(
      clientY - (rect.top + rect.height / 2),
      clientX - (rect.left + rect.width / 2)
    );
  }, []);

  // Animation loop — runs always; only pauses rotation advance during active CW drag
  // (the drag handler takes over rotation during CW moves for immediate feel)
  useEffect(() => {
    let animId: number;
    let lastFrame = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;

      // Advance rotation whenever NOT actively doing a CW drag gesture
      // This keeps the wheel spinning during: idle, CCW touches, finger-on-wheel
      if (!isCWDragging.current && !pausedRef.current) {
        velocity.current = Math.max(
          velocity.current * Math.exp(-DECAY_RATE * dt),
          IDLE_VELOCITY
        );

        const moved = velocity.current * dt;
        rotation.current += moved;

        if (velocity.current > IDLE_VELOCITY + 0.05) {
          checkRevolutions(moved);
        }

        if (containerRef.current) {
          containerRef.current.style.transform = `rotate(${rotation.current}rad)`;
        }
      }

      if (velocityRef) velocityRef.current = velocity.current;
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [checkRevolutions]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      containerRef.current?.setPointerCapture(e.pointerId);
      isDragging.current = true;
      isCWDragging.current = false;
      lastAngle.current = getAngle(e.clientX, e.clientY);
      lastMoveTime.current = performance.now();
      // Do NOT zero velocity — wheel keeps its momentum when touched
    },
    [getAngle]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const now = performance.now();
      const dt = Math.max((now - lastMoveTime.current) / 1000, 0.001);
      const angle = getAngle(e.clientX, e.clientY);

      let delta = angle - lastAngle.current;
      while (delta > Math.PI) delta -= TAU;
      while (delta < -Math.PI) delta += TAU;

      const cwDelta = Math.max(0, delta);

      if (cwDelta > 0) {
        // Active clockwise movement — take over from the loop
        isCWDragging.current = true;
        rotation.current += cwDelta;
        velocity.current = Math.min(MAX_VELOCITY, cwDelta / dt);
        checkRevolutions(cwDelta);
        if (containerRef.current) {
          containerRef.current.style.transform = `rotate(${rotation.current}rad)`;
        }
      } else {
        // Counter-clockwise or stationary — yield back to the loop
        // Do NOT alter velocity; wheel keeps whatever momentum it has
        isCWDragging.current = false;
      }

      lastAngle.current = angle;
      lastMoveTime.current = now;
    },
    [getAngle, checkRevolutions]
  );

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    isCWDragging.current = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className="select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ touchAction: "none", willChange: "transform" }}
    >
      <Mandala level={level} className={className} mantraProgress={mantraProgress} />
    </div>
  );
}
