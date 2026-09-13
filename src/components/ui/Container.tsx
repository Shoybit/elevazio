import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerTone = "content" | "shell";

export interface ContainerProps {
  children: ReactNode;
  as?: ElementType;
  tone?: ContainerTone;
  className?: string;
  id?: string;
}

/**
 * Horizontal page rhythm.
 *
 * The reference uses two distinct widths, and they are not interchangeable:
 *
 * - `content` — the boxed column that section copy, grids and cards sit in,
 *   capped at 1470px.
 * - `shell` — the near-full-bleed inset used by the header pill and the footer
 *   card, which run almost the full width of the viewport.
 */
export function Container({
  children,
  as: Tag = "div",
  tone = "content",
  className,
  id,
}: ContainerProps) {
  return (
    <Tag
      id={id}
      className={cn(
        tone === "shell"
          ? "mx-auto w-full px-[0.9375rem] lg:px-[2.1875rem]"
          : "mx-auto w-full max-w-[1470px] px-[0.9375rem] md:px-[1.875rem] lg:px-8",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
