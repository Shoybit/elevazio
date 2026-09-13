import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "light" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<ComponentProps<"a">, "href"> {
  children: ReactNode;
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: boolean;
  /**
   * Overrides the arrow badge's colour. The default inverts against the pill,
   * but a lime button sitting on the dark header wants a dark badge instead of
   * the usual white one.
   */
  iconTone?: string;
  className?: string;
  external?: boolean;
}

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-3 rounded-full font-display font-semibold leading-none transition-[color,background-color,border-color,transform] duration-500 ease-[var(--ease-out-expo)] active:scale-[0.97]";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-accent hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(228,237,100,0.75)]",
  light:
    "bg-canvas text-accent hover:bg-primary hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-14px_rgba(0,0,0,0.45)]",
  outline:
    "border border-line bg-transparent text-accent hover:border-accent hover:-translate-y-0.5",
  ghost: "bg-transparent text-accent hover:text-ink-light",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-11 px-6 text-[0.9375rem]",
  md: "h-13 px-7 text-base",
  lg: "h-15 px-9 text-base",
};

/**
 * The circular arrow badge that sits on the trailing edge of an `icon` button.
 *
 * It always inverts against its own pill: the reference pairs a white circle
 * with the lime call-to-action and a lime circle with the white one, so the
 * arrow stays dark and legible either way.
 */
const iconTones: Record<ButtonVariant, string> = {
  primary: "bg-canvas text-accent",
  light: "bg-primary text-accent",
  outline: "bg-accent text-primary",
  ghost: "bg-accent text-primary",
};

/**
 * Primary call-to-action. Renders an `<a>` (via next/link for internal
 * routes) so it is a real, keyboard-accessible link.
 */
export function Button({
  children,
  href,
  variant = "primary",
  size = "sm",
  icon = false,
  iconTone,
  className,
  external,
  ...rest
}: ButtonProps) {
  const isExternal = external ?? href.startsWith("http");
  const tone = iconTone ?? iconTones[variant];
  const classes = cn(
    base,
    variants[variant],
    sizes[size],
    icon && "pl-6",
    className,
  );

  const content = (
    <>
      <span className="relative z-10 whitespace-nowrap">{children}</span>
      {icon ? (
        <span
          className={cn(
            "relative z-10 flex size-[1.375rem] items-center justify-center overflow-hidden rounded-full",
            tone,
          )}
        >
          <ArrowRight
            aria-hidden
            className="size-3.5 -translate-x-[130%] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-0"
          />
          <ArrowRight
            aria-hidden
            className="absolute size-3.5 -translate-x-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-[130%]"
          />
        </span>
      ) : null}
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        rel="noreferrer noopener"
        target="_blank"
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}
