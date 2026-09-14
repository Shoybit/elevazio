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

/**
 * The Elevazio lockup.
 *
 * Two variants ship with the brand kit: the near-black wordmark for light
 * surfaces and the reversed one for dark panels. Height is the only control so
 * the mark can never be squashed out of proportion.
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
      preload={priority}
      className={cn("w-auto", className)}
    />
  );
}
