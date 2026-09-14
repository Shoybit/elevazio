"use client";

import { type ReactNode, useRef } from "react";
import { motion, useInView, type Variants } from "motion/react";

export type RevealDirection = "up" | "down" | "left" | "right" | "none";

export interface RevealProps {
  children: ReactNode;
  className?: string;
  id?: string;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
  as?: "div" | "li" | "span" | "section" | "article";
}

const offsets: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 44 },
  down: { x: 0, y: -44 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Scroll-triggered entrance built on transform + opacity only, so it stays on
 * the compositor. The offset is neutralised by CSS under reduced motion, which
 * keeps the server and client markup identical.
 */
export function Reveal({
  children,
  className,
  id,
  direction = "up",
  delay = 0,
  duration = 0.85,
  amount = 0.25,
  once = true,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount });
  // `motion` types the ref per-tag; every tag we allow accepts an HTMLElement
  // ref at runtime, so normalising to the `div` signature keeps this type-safe.
  const MotionTag = motion[as] as typeof motion.div;
  const offset = offsets[direction];

  const variants: Variants = {
    hidden: { opacity: 0, x: offset.x, y: offset.y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <MotionTag
      ref={ref}
      id={id}
      data-motion-transform=""
      className={className}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </MotionTag>
  );
}
