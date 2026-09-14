import { cn } from "@/lib/utils";

export type NotchPosition = "tl" | "tr" | "bl" | "br";

const positionClass: Record<NotchPosition, string> = {
  tl: "left-0 top-0 rounded-tr-[1.875rem]",
  tr: "right-0 top-0 rounded-bl-[1.875rem]",
  bl: "left-0 bottom-0 rounded-tr-[1.875rem]",
  br: "right-0 bottom-0 rounded-tl-[1.875rem]",
};

export interface CornerNotchProps {
  position?: NotchPosition;
  /** Colour of the surrounding surface; the notch is painted in this tone. */
  className?: string;
}

/**
 * The reference's signature detail: a quarter-round "bite" taken out of a
 * card corner, filled with the surrounding surface colour. Implemented as a
 * quarter disc so the curve stays perfectly smooth at every breakpoint.
 */
export function CornerNotch({
  position = "tl",
  className,
}: CornerNotchProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute size-[1.875rem]",
        positionClass[position],
        className,
      )}
    />
  );
}
