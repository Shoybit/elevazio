"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { formatNumber } from "@/lib/utils";

export interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

/**
 * Counts up once the element enters the viewport. A single rAF loop drives the
 * value; the effect body itself never calls setState, only schedules it from
 * an animation frame callback.
 */
export function Counter({
  value,
  suffix = "",
  duration = 1.8,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  // `useReducedMotion` resolves to `null` on the first render and then settles
  // to a boolean. Treating `null` as "not yet known" keeps the loop from
  // starting and then being cancelled and restarted one tick later.
  const motionKnown = reduceMotion !== null;

  useEffect(() => {
    if (!inView || !motionKnown) return;

    if (reduceMotion) {
      const settled = requestAnimationFrame(() => setProgress(1));
      return () => cancelAnimationFrame(settled);
    }

    let frame = 0;
    let start: number | null = null;

    const tick = (time: number) => {
      start ??= time;
      const elapsed = Math.min((time - start) / (duration * 1000), 1);
      // easeOutExpo
      setProgress(elapsed === 1 ? 1 : 1 - Math.pow(2, -10 * elapsed));
      if (elapsed < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, duration, reduceMotion, motionKnown]);

  const display = reduceMotion ? value : Math.round(progress * value);

  return (
    <span ref={ref} className={className}>
      {formatNumber(display)}
      {suffix}
    </span>
  );
}
