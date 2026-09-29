import Image from "next/image";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Intrinsic size of the supplied wordmark artwork.
 *
 * Every reference lockup is the same 906x222 file, so the aspect ratio is fixed
 * and callers only ever need to pick a height.
 */
const WORDMARK = { width: 906, height: 222 } as const;

/** width / height of the artwork, used to size the responsive `srcset`. */
const WORDMARK_RATIO = WORDMARK.width / WORDMARK.height;

/**
 * The Elevazio lockup.
 *
 * Two variants ship with the brand kit: the near-black wordmark for light
 * surfaces and the reversed one for dark panels. Height is the only control so
 * the mark can never be squashed out of proportion.
 *
 * `sizes` is required even though the image is not `fill`: without it the
 * browser falls back to a `100vw` slot and downloads the largest variant in
 * the set (~1920px) for a logo that is 90px wide on screen.
 */
export function Brand({
  variant = "dark",
  className,
  priority = false,
}: {
  variant?: "dark" | "light";
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={
        variant === "light"
          ? "/images/brand/elevazio-wordmark-inverse.png"
          : "/images/brand/elevazio-wordmark.png"
      }
      alt={siteConfig.name}
      width={WORDMARK.width}
      height={WORDMARK.height}
      sizes={`${Math.round(32 * WORDMARK_RATIO)}px`}
      preload={priority}
      className={cn("w-auto", className)}
    />
  );
}
