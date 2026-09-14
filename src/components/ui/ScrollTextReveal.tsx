"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { TextReveal } from "@/components/ui/TextReveal";

export interface ScrollTextRevealProps {
  text: string;
  as: "h1" | "h2" | "h3" | "h4" | "p";
  className?: string;
  stagger?: number;
  delay?: number;
  id?: string;
}

/**
 * TextReveal bound to its own in-view trigger, so callers do not have to own
 * the intersection state.
 */
export function ScrollTextReveal({
  text,
  as,
  className,
  stagger = 0.07,
  delay = 0,
  id,
}: ScrollTextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <div ref={ref}>
      <TextReveal
        text={text}
        as={as}
        active={inView}
        className={className}
        stagger={stagger}
        delay={delay}
        id={id}
      />
    </div>
  );
}
