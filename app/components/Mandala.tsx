"use client";

const TAU = Math.PI * 2;

function polar(deg: number, r: number) {
  const a = (deg * Math.PI) / 180;
  return { x: Math.cos(a) * r, y: Math.sin(a) * r };
}

const MANTRA = ["OM", "MAṆI", "PADME", "HŪM"];

interface MandalaProps {
  level: number;
  className?: string;
  mantraProgress?: number;
}

export default function Mandala({ level, className = "", mantraProgress = 0 }: MandalaProps) {
  const gold = "#c9a227";
  const purple = "#a855f7";
  const blue = "#38bdf8";
  const pink = "#f0abfc";

  return (
    <svg
      viewBox="-100 -100 200 200"
      className={className}
      style={{
        filter:
          level >= 7
            ? "drop-shadow(0 0 24px rgba(201,162,39,0.6)) drop-shadow(0 0 8px rgba(201,162,39,0.4))"
            : level >= 4
            ? "drop-shadow(0 0 8px rgba(201,162,39,0.2))"
            : undefined,
      }}
    >
      {/* ── LEVEL 0 (always): Dharmachakra ── */}

      {/* Outer rim */}
      <circle cx="0" cy="0" r="88" fill="none" stroke={gold} strokeWidth="3" />
      {/* Inner rim accent */}
      <circle cx="0" cy="0" r="82" fill="none" stroke={gold} strokeWidth="0.5" opacity="0.4" />

      {/* 8 spokes */}
      {Array.from({ length: 8 }, (_, i) => {
        const deg = (i * 360) / 8;
        const a = (deg * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={Math.cos(a) * 20}
            y1={Math.sin(a) * 20}
            x2={Math.cos(a) * 84}
            y2={Math.sin(a) * 84}
            stroke={gold}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      })}

      {/* Spoke tip circles */}
      {Array.from({ length: 8 }, (_, i) => {
        const p = polar((i * 360) / 8, 84);
        return <circle key={i} cx={p.x} cy={p.y} r="4" fill={gold} />;
      })}

      {/* Hub ring */}
      <circle cx="0" cy="0" r="20" fill="none" stroke={gold} strokeWidth="2" />
      {/* Center jewel */}
      <circle cx="0" cy="0" r="8" fill={gold} />
      <circle cx="0" cy="0" r="4" fill="#080605" />

      {/* ── LEVEL 1: Inner lotus — 8 petals between spokes ── */}
      {level >= 1 &&
        Array.from({ length: 8 }, (_, i) => {
          const deg = (i * 360) / 8 + 22.5;
          const p = polar(deg, 42);
          return (
            <ellipse
              key={i}
              cx={p.x}
              cy={p.y}
              rx="9"
              ry="18"
              transform={`rotate(${deg - 90}, ${p.x}, ${p.y})`}
              fill={`${gold}33`}
              stroke={gold}
              strokeWidth="1"
            />
          );
        })}

      {/* ── LEVEL 2: Octagram (two overlapping squares) ── */}
      {level >= 2 && (
        <>
          {/* Diamond orientation */}
          <polygon
            points="0,-55 55,0 0,55 -55,0"
            fill="none"
            stroke={purple}
            strokeWidth="1.5"
            opacity="0.85"
          />
          {/* Axis-aligned square */}
          <polygon
            points="-39,-39 39,-39 39,39 -39,39"
            fill="none"
            stroke={purple}
            strokeWidth="1.5"
            opacity="0.85"
          />
        </>
      )}

      {/* ── LEVEL 3: Outer lotus — 16 petals near rim ── */}
      {level >= 3 &&
        Array.from({ length: 16 }, (_, i) => {
          const deg = (i * 360) / 16;
          const p = polar(deg, 68);
          return (
            <ellipse
              key={i}
              cx={p.x}
              cy={p.y}
              rx="5"
              ry="12"
              transform={`rotate(${deg - 90}, ${p.x}, ${p.y})`}
              fill={`${gold}22`}
              stroke={gold}
              strokeWidth="0.8"
              opacity="0.9"
            />
          );
        })}

      {/* ── LEVEL 4: Hexagram (vajra) ── */}
      {level >= 4 && (
        <>
          {/* Triangle pointing up */}
          <polygon
            points="0,-52 45,26 -45,26"
            fill="none"
            stroke={blue}
            strokeWidth="1.5"
            opacity="0.85"
          />
          {/* Triangle pointing down */}
          <polygon
            points="0,52 45,-26 -45,-26"
            fill="none"
            stroke={blue}
            strokeWidth="1.5"
            opacity="0.85"
          />
        </>
      )}

      {/* ── LEVEL 5: Ring of 24 dots ── */}
      {level >= 5 &&
        Array.from({ length: 24 }, (_, i) => {
          const p = polar((i * 360) / 24, 77);
          return <circle key={i} cx={p.x} cy={p.y} r="2" fill={blue} opacity="0.75" />;
        })}

      {/* ── LEVEL 6: Flower of life ── */}
      {level >= 6 && (
        <>
          <circle cx="0" cy="0" r="27" fill="none" stroke={pink} strokeWidth="1" opacity="0.65" />
          {Array.from({ length: 6 }, (_, i) => {
            const p = polar(i * 60, 27);
            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="27"
                fill="none"
                stroke={pink}
                strokeWidth="1"
                opacity="0.65"
              />
            );
          })}
        </>
      )}

      {/* ── LEVEL 7: Complete mandala ── */}
      {level >= 7 && (
        <>
          {/* Extra outer ring */}
          <circle cx="0" cy="0" r="94" fill="none" stroke={pink} strokeWidth="1.5" opacity="0.7" />
          {/* Glow dots on outer ring */}
          {Array.from({ length: 12 }, (_, i) => {
            const p = polar((i * 360) / 12, 94);
            return <circle key={i} cx={p.x} cy={p.y} r="2.5" fill={pink} opacity="0.85" />;
          })}
          {/* Bright central jewel */}
          <circle cx="0" cy="0" r="10" fill="none" stroke="white" strokeWidth="0.8" opacity="0.5" />
          <circle cx="0" cy="0" r="5" fill="white" opacity="0.95" />
        </>
      )}

      {/* ── MANTRA CENTER: syllables stacked in hub, progressive reveal ── */}
      {mantraProgress > 0 && (
        <>
          {/* Dark backing so text reads over the gold jewel */}
          <circle cx="0" cy="0" r="18" fill="#080605" fillOpacity="0.72" />
          {MANTRA.map((word, i) => (
            <text
              key={i}
              x="0"
              y={-8.25 + i * 5.5}
              fontSize="4.5"
              fill={i < mantraProgress ? gold : "#f5e6c8"}
              fillOpacity={i < mantraProgress ? 0.85 : 0.08}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {word}
            </text>
          ))}
        </>
      )}

      {/* ── MANTRA RING C: dense inscription band at r=80 when mantra complete ── */}
      {mantraProgress >= 4 && (
        <>
          <defs>
            <path id="mantra-ring-c" d="M 0,-80 A 80,80 0 1,1 0,80 A 80,80 0 1,1 0,-80" />
          </defs>
          <text fontSize="3.5" fill={gold} fillOpacity="0.35" letterSpacing="1">
            <textPath href="#mantra-ring-c">
              {"OM MAṆI PADME HŪM · ".repeat(9)}
            </textPath>
          </text>
        </>
      )}
    </svg>
  );
}
