"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Lets Motion disable transform/layout animations for visitors who prefer
 * reduced motion, without any component having to branch on the media query
 * during render (which would break hydration).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
