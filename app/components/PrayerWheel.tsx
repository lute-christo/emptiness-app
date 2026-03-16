"use client";

import { useRef, useEffect, useCallback } from "react";
import Mandala from "./Mandala";

interface PrayerWheelProps {
  level: number;
  onRevolution: () => void; // called once per completed CW revolution; karma handled by hook
}

const TAU = Math.PI * 2;

const IDLE_VELOCITY = 0.08;
const DECAY_RATE = 0.15;
const MAX_VELOCITY = 15;

export default function PrayerWheel({ level, onRevolution }: PrayerWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotation = useRef(0);          // visual rotation (always increasing, radians)
  const velocity = useRef(IDLE_VELOCITY); // current angular velocity (always >= 0, CW only)
  const isDragging = useRef(false);
  const lastAngle = useRef(0);
  const lastMoveTime = useRef(0);

  // Karma tracking — counts completed full CW revolutions
  const accumulatedCW = useRef(0); // total CW radians traveled (for karma counting)
  const lastRevCount = useRef(0);  // how many full revolutions have already been rewarded

  const onRevolutionRef = useRef(onRevolution);
  onRevolutionRef.current = onRevolution;

  // Fire onRevolution once per completed CW revolution
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

  // Animation loop — runs for the lifetime of the component
  useEffect(() => {
    let animId: number;
    let lastFrame = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;

      if (!isDragging.current) {
        // Exponential decay — gentle, gives long coasting after a good spin
        velocity.current = Math.max(
          velocity.current * Math.exp(-DECAY_RATE * dt),
          IDLE_VELOCITY
        );

        const moved = velocity.current * dt;
        rotation.current += moved;

        // Only count revolutions from meaningful momentum, not idle drift
        if (velocity.current > IDLE_VELOCITY + 0.05) {
          checkRevolutions(moved);
        }

        if (containerRef.current) {
          containerRef.current.style.transform = `rotate(${rotation.current}rad)`;
        }
      }

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
      lastAngle.current = getAngle(e.clientX, e.clientY);
      lastMoveTime.current = performance.now();
      velocity.current = 0;
    },
    [getAngle]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const now = performance.now();
      const dt = Math.max((now - lastMoveTime.current) / 1000, 0.001);
      const angle = getAngle(e.clientX, e.clientY);

      // Raw angular delta, wrapped to [-π, π]
      let delta = angle - lastAngle.current;
      while (delta > Math.PI) delta -= TAU;
      while (delta < -Math.PI) delta += TAU;

      // Clockwise only — ignore or clamp any counter-clockwise movement
      const cwDelta = Math.max(0, delta);

      if (cwDelta > 0) {
        rotation.current += cwDelta;
        velocity.current = Math.min(MAX_VELOCITY, cwDelta / dt);
        checkRevolutions(cwDelta);

        if (containerRef.current) {
          containerRef.current.style.transform = `rotate(${rotation.current}rad)`;
        }
      } else {
        // CCW drag: freeze the wheel, bleed off velocity so release doesn't coast
        velocity.current = Math.max(0, velocity.current * 0.8);
      }

      lastAngle.current = angle;
      lastMoveTime.current = now;
    },
    [getAngle, checkRevolutions]
  );

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    // velocity is already clamped to [0, MAX_VELOCITY] from drag handler
  }, []);

  return (
    <div
      ref={containerRef}
      className="cursor-grab active:cursor-grabbing select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ touchAction: "none", willChange: "transform" }}
    >
      <Mandala level={level} className="w-72 h-72 md:w-80 md:h-80" />
    </div>
  );
}
