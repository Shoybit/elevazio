"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

export interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** Radius in pixels within which the element starts to follow the pointer. */
  radius?: number;
}

/**
 * Magnetic hover attraction — the element drifts toward the pointer within a
 * soft radius, then springs back. The pointer handlers become no-ops under
 * reduced motion, so the markup stays identical in both cases.
 */
export function Magnetic({ children, className, radius = 90 }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 22, mass: 0.5 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 22, mass: 0.5 });

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ x, y }}
      onPointerMove={(event) => {
        if (reduceMotion) return;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const distance = Math.hypot(dx, dy);
        if (distance > radius + Math.max(rect.width, rect.height) / 2) {
          x.set(0);
          y.set(0);
          return;
        }
        const falloff = 1 - Math.min(distance / (radius * 2.2), 1);
        x.set(dx * falloff * 0.55);
        y.set(dy * falloff * 0.55);
      }}
      onPointerLeave={() => {
        if (reduceMotion) return;
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
