let ctx: AudioContext | null = null;
let lastBellTime = 0;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  freq: number,
  duration: number,
  gain: number,
  type: OscillatorType = "sine",
  delayMs = 0
) {
  const c = getCtx();
  if (!c) return;
  try {
    const startAt = c.currentTime + delayMs / 1000;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.connect(g);
    g.connect(c.destination);
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, startAt);
    g.gain.linearRampToValueAtTime(gain, startAt + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    osc.start(startAt);
    osc.stop(startAt + duration);
  } catch {}
}

// Throttled to 800ms — sounds natural even at high spin speed
export function playRevolutionBell() {
  const now = Date.now();
  if (now - lastBellTime < 800) return;
  lastBellTime = now;
  tone(880, 0.7, 0.1); // A5, soft, brief
}

// Two-tone ascending chime for ring moments
export function playLevelUpChime() {
  tone(660, 1.4, 0.15);       // E5
  tone(880, 1.2, 0.1, "sine", 180); // A5 follow
}

// Deep resonant bell for dissolution
export function playDissolutionBell() {
  tone(220, 3.5, 0.2);         // A3, deep
  tone(330, 2.8, 0.08, "sine", 250); // E4 overtone
}

// Warm mid tone for ordination
export function playOrdinationChime() {
  tone(528, 1.5, 0.13);        // C5ish
}
