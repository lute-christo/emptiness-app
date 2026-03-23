"use client";

import React, { useRef, useEffect, useCallback } from "react";
import Mandala, { ColorScheme } from "./Mandala";

const TAU = Math.PI * 2;
const DECAY_RATE = 0.15;
const MAX_VELOCITY = 15;

interface SpinningMandalaProps {
  level: number;
  className?: string;
  speed?: number; // radians per second — also acts as idle velocity floor
  name?: string;
  onRevolution?: () => void;
  velocityRef?: React.MutableRefObject<number>;
  colorScheme?: ColorScheme;
}

export default function SpinningMandala({
  level,
  className = "",
  speed = 0.25,
  name,
  onRevolution,
  velocityRef,
  colorScheme,
}: SpinningMandalaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotation = useRef(Math.random() * TAU);
  const velocity = useRef(speed);

  const isDragging = useRef(false);
  const isCWDragging = useRef(false);
  const lastAngle = useRef(0);
  const lastMoveTime = useRef(0);
  const accumulatedCW = useRef(0);
  const lastRevCount = useRef(0);

  const onRevolutionRef = useRef(onRevolution);
  onRevolutionRef.current = onRevolution;

  const checkRevolutions = useCallback((addedRadians: number) => {
    accumulatedCW.current += addedRadians;
    const totalRevs = Math.floor(accumulatedCW.current / TAU);
    const newRevs = totalRevs - lastRevCount.current;
    for (let i = 0; i < newRevs; i++) {
      onRevolutionRef.current?.();
    }
    lastRevCount.current = totalRevs;
  }, []);

  const getAngle = useCallback((clientX: number, clientY: number): number => {
    const rect = ref.current!.getBoundingClientRect();
    return Math.atan2(
      clientY - (rect.top + rect.height / 2),
      clientX - (rect.left + rect.width / 2)
    );
  }, []);

  useEffect(() => {
    velocity.current = speed;
  }, [speed]);

  useEffect(() => {
    let animId: number;
    let lastFrame = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;

      if (!isCWDragging.current) {
        velocity.current = Math.max(
          velocity.current * Math.exp(-DECAY_RATE * dt),
          speed
        );
        const moved = velocity.current * dt;
        rotation.current += moved;

        if (velocity.current > speed + 0.05) {
          checkRevolutions(moved);
        }

        if (ref.current) {
          ref.current.style.transform = `rotate(${rotation.current}rad)`;
        }
      }

      if (velocityRef) velocityRef.current = velocity.current;
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [speed, checkRevolutions]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      ref.current?.setPointerCapture(e.pointerId);
      isDragging.current = true;
      isCWDragging.current = false;
      lastAngle.current = getAngle(e.clientX, e.clientY);
      lastMoveTime.current = performance.now();
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
        isCWDragging.current = true;
        rotation.current += cwDelta;
        velocity.current = Math.min(MAX_VELOCITY, cwDelta / dt);
        checkRevolutions(cwDelta);
        if (ref.current) {
          ref.current.style.transform = `rotate(${rotation.current}rad)`;
        }
      } else {
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
    <div className="flex flex-col items-center gap-1">
      <div
        ref={ref}
        style={{ willChange: "transform", touchAction: "none" }}
        className="select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <Mandala level={level} className={className} colorScheme={colorScheme} />
      </div>
      {name && (
        <span className="text-[10px] text-[#c9a227]/30 tracking-widest uppercase">
          {name}
        </span>
      )}
    </div>
  );
}
