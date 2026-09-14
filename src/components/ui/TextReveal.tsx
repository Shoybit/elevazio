"use client";

import { useMemo } from "react";
import { motion, type Variants } from "motion/react";

export interface TextRevealProps {
  /** Split on spaces, keeping the words themselves intact. */
  text: string;
  className?: string;
  /** Triggers the reveal; typically bound to an in-view flag from the parent. */
  active: boolean;
  delay?: number;
  stagger?: number;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  id?: string;
}

const wordVariants: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Word-by-word mask reveal. Each word rises out of an overflow-hidden clip so
 * it reads as one continuous line of type. The markup is identical on server
 * and client; reduced motion is neutralised in CSS.
 */
export function TextReveal({
  text,
  className,
  active,
  delay = 0,
  stagger = 0.07,
  duration = 0.9,
  as = "h2",
  id,
}: TextRevealProps) {
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);
  const MotionTag = motion[as];

  return (
    <MotionTag
      id={id}
      className={className}
      aria-label={text}
      initial="hidden"
      animate={active ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          aria-hidden
          className="inline-flex overflow-hidden pb-[0.12em] pr-[0.26em]"
        >
          <motion.span
            data-motion-transform=""
            className="inline-block will-change-transform"
            variants={wordVariants}
            transition={{ duration }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
