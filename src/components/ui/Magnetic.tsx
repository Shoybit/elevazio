"use client";

import { useEffect, useRef, type ReactNode } from "react";
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

  /**
   * Pointer tracking is bound to `window` rather than to the element.
   *
   * `onPointerMove` on the element only fires while the pointer is already
   * over it, so the `radius` falloff could never do its job: by the time the
   * handler ran, the distance was always zero and the element snapped to the
   * pointer with no easing in. Listening on the window lets the magnet start
   * attracting from `radius` pixels away, which is what the prop promises.
   */
  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;

    const onPointerMove = (event: PointerEvent) => {
      // Ignore secondary buttons and touch, where "hover" is not a concept.
      if (event.pointerType !== "mouse" || event.buttons !== 1) return;
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);
      const reach = radius + Math.max(rect.width, rect.height) / 2;
      if (distance > reach) {
        x.set(0);
        y.set(0);
        return;
      }
      const falloff = 1 - distance / reach;
      x.set(dx * falloff * 0.55);
      y.set(dy * falloff * 0.55);
    };

    const release = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", release);
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", release);
      window.removeEventListener("blur", release);
    };
  }, [radius, reduceMotion, x, y]);

  return (
    <motion.span ref={ref} className={className} style={{ x, y }}>
      {children}
    </motion.span>
  );
}
