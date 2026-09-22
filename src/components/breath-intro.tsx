import { useEffect, useRef, useState } from "react";

/**
 * Ruhige Atem-Sequenz beim Öffnen der App (nur als installierte Web-App).
 * Einatmen · Ausatmen, dann öffnet sich die Seite.
 */

const PHASES = [
  { label: "Einatmen", hint: "vier Sekunden", duration: 4000, grow: true },
  { label: "Ausatmen", hint: "sechs Sekunden", duration: 6000, grow: false },
] as const;

const SESSION_KEY = "klartext-breath-intro";

export function BreathIntro() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [phase, setPhase] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = window.sessionStorage.getItem(SESSION_KEY) === "1";

    if (!standalone || reduced || seen) return;

    window.sessionStorage.setItem(SESSION_KEY, "1");
    setIsVisible(true);

    const total = PHASES.reduce((sum, item) => sum + item.duration, 0);

    timers.current.push(
      window.setTimeout(() => setPhase(1), PHASES[0].duration),
      window.setTimeout(() => setIsLeaving(true), total),
      window.setTimeout(() => setIsVisible(false), total + 700),
    );

    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
  }, []);

  if (!isVisible) return null;

  const current = PHASES[phase] ?? PHASES[0];

  const skip = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    setIsLeaving(true);
    window.setTimeout(() => setIsVisible(false), 500);
  };

  return (
    <div
      className={`breath-intro${isLeaving ? " is-leaving" : ""}`}
      role="status"
      aria-live="polite"
    >
      <div className="breath-intro__stage">
        <span
          className={`breath-intro__orb${current.grow ? " is-in" : " is-out"}`}
          style={{ animationDuration: `${current.duration}ms` }}
          aria-hidden="true"
        />
        <p className="breath-intro__label">{current.label}</p>
        <p className="breath-intro__hint">{current.hint}</p>
      </div>

      <button type="button" className="breath-intro__skip" onClick={skip}>
        Überspringen
      </button>
    </div>
  );
}
