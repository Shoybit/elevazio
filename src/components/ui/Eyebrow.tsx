import { cn } from "@/lib/utils";

export interface EyebrowProps {
  children: string;
  tone?: "accent" | "canvas";
  className?: string;
}

export function Eyebrow({
  children,
  tone = "accent",
  className,
}: EyebrowProps) {
  const toneStyles = {
    accent: {
      shell: "border-primary text-accent",
      label: "text-ink-light",
    },
    canvas: {
      shell: "border-primary text-canvas",
      label: "text-canvas/60",
    },
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex min-h-8.75 min-w-32.5 max-w-full items-center rounded-full border px-5",
        toneStyles.shell,
        className,
      )}
    >
      <span
        className={cn(
          "flex min-w-0 items-center whitespace-nowrap font-display text-[0.62rem] font-semibold uppercase tracking-[0.08em]",
          toneStyles.label,
        )}
      >
        <span className="truncate">{children}</span>

        <span
          aria-hidden="true"
          className="mx-2.5 size-1 shrink-0 rounded-full bg-primary"
        />
      </span>
    </span>
  );
}