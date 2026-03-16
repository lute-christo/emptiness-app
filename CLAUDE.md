# EMPTINESS — Project Instructions

## Concept

EMPTINESS is a Buddhist-themed idle game built around spinning prayer wheels and mandala progression.

The tone is **playfully unserious but thematically honest** — the joke is that idle games are fundamentally empty activity, and prayer wheels accumulate merit through repetition. The "well, actually this might count" tension is intentional and core to the identity.

The name references śūnyatā (Buddhist concept of emptiness) and the explicit emptiness of idle game mechanics.

---

## Core Game Loop

1. Player swipes/drags the prayer wheel to spin it manually → generates karma
2. Karma accumulates (idle + active)
3. Enough karma → unlock next mandala level
4. Each level adds a ring/layer to the mandala, making it more visually complex
5. Buy auto-spinners → generate karma passively
6. Upgrade auto-spinners → faster karma generation
7. Complete the full mandala → Dissolution (prestige) → restart with a merit multiplier

---

## Spinning Mechanic

- **Swipe/drag** on the wheel (not tap a button) — track drag angle and velocity around the wheel's center
- Faster swipe = more karma per gesture, wheel spins faster
- Wheel has momentum — gradually slows after a swipe
- Implementation: pointer events (`pointerdown`, `pointermove`, `pointerup`) to track drag angle and velocity
- The mandala always visually spins (CSS animation or SVG)

---

## Mandala Progression

- Starts as a bare prayer wheel
- Each level adds a ring or layer of complexity to the mandala
- Levels: approximately 7–10 total
- The mandala is always spinning visually
- More complexity = more visually rewarding

---

## Auto-Spinners

Follows classic idle game structure:

- Buy auto-spinners to generate karma passively
- Upgrade them to spin faster
- Spinner tiers follow Buddhist/monastic hierarchy:
  - Novice Monk
  - Monk
  - Lama
  - Rinpoche
  - Bodhisattva
  - (etc.)

Each tier costs more karma, generates more per second.

---

## Prestige — "Dissolution"

- Do not call it "prestige" in-game — call it **Dissolution** or **Release** or **Rebirth**
- When full mandala is complete, it dissolves — karma and spinners reset
- Player keeps a **merit multiplier** that carries forward to the next cycle
- Thematic framing: impermanence. You built something beautiful, now let it go.

---

## Monetization — Dana

- **No ads. No paywalls. No pay-to-win.**
- After first Dissolution, a Dana prompt appears (one time, not repeated aggressively)
- Dana = Buddhist concept of generosity/giving
- Framing: *"This wheel has been spinning for you. If it's brought you anything, leave what feels right."*
- Links to Ko-fi (pay what you want)
- Transparency in app: *"Dana collected here covers development costs. The rest goes to the Glass Shrine Sangha."*
- Dana option also accessible from Settings at any time

---

## Tech Stack

- Next.js (App Router)
- React 19 with React Compiler
- TypeScript
- Tailwind CSS
- Deploy on Vercel
- Mobile via Capacitor (later)

---

## Working Rules

Before editing files:

1. Read the repository structure first.
2. Explain planned changes before making them.
3. Prefer small focused changes over large rewrites.

## Code Style

- Follow existing patterns in the repository.
- Do not introduce new libraries unless necessary.
- Keep components simple and readable.
- Avoid unnecessary abstractions.

## UI Rules

- Preserve the existing visual style once established.
- Do not redesign UI unless explicitly requested.

## Safety Rules

Never:
- Rewrite large sections without explanation
- Introduce heavy dependencies
- Break existing features
