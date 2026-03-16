"use client";

import { useRef, useEffect, useCallback } from "react";
import Mandala from "./Mandala";

interface PrayerWheelProps {
  level: number;
  onSpin: (karma: number) => void;
}

const IDLE_VELOCITY = 0.12; // rad/s — gentle base rotation
const DECAY = 0.95; // velocity multiplier per 60fps frame
const KARMA_PER_RAD = 5; // karma earned per radian of active spin
const MAX_VELOCITY = 20; // cap to prevent instant huge karma

export default function PrayerWheel({ level, onSpin }: PrayerWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotation = useRef(0);
  const velocity = useRef(IDLE_VELOCITY);
  const isDragging = useRef(false);
  const lastAngle = useRef(0);
  const lastMoveTime = useRef(0);
  const onSpinRef = useRef(onSpin);
  onSpinRef.current = onSpin;

  // Get angle of pointer relative to wheel center
  const getAngle = useCallback((clientX: number, clientY: number): number => {
    const rect = containerRef.current!.getBoundingClientRect();
    return Math.atan2(clientY - (rect.top + rect.height / 2), clientX - (rect.left + rect.width / 2));
  }, []);

  // Animation loop — runs for the lifetime of the component
  useEffect(() => {
    let animId: number;
    let lastFrame = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;

      if (!isDragging.current) {
        // Decay towards idle velocity
        if (Math.abs(velocity.current) > IDLE_VELOCITY) {
          velocity.current *= Math.pow(DECAY, dt * 60);
          if (Math.abs(velocity.current) < IDLE_VELOCITY) {
            velocity.current = IDLE_VELOCITY;
          }
        } else {
          velocity.current = IDLE_VELOCITY;
        }

        rotation.current += velocity.current * dt;

        // Karma from momentum above idle threshold
        const excess = Math.abs(velocity.current) - IDLE_VELOCITY;
        if (excess > 0.2) {
          onSpinRef.current(excess * dt * KARMA_PER_RAD);
        }
      }

      if (containerRef.current) {
        containerRef.current.style.transform = `rotate(${rotation.current}rad)`;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

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

      // Angular delta, wrapped to [-π, π]
      let delta = angle - lastAngle.current;
      while (delta > Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;

      rotation.current += delta;
      velocity.current = delta / dt;

      if (containerRef.current) {
        containerRef.current.style.transform = `rotate(${rotation.current}rad)`;
      }

      // Karma from this movement
      const karmaGained = Math.abs(delta) * KARMA_PER_RAD;
      if (karmaGained > 0.001) {
        onSpinRef.current(karmaGained);
      }

      lastAngle.current = angle;
      lastMoveTime.current = now;
    },
    [getAngle]
  );

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    // Cap velocity so a very fast flick doesn't earn absurd karma on release
    velocity.current = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity.current));
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
