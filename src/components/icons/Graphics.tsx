import type { ReactNode } from "react";

/** Circular rotating text ring used behind the testimonial avatar. */
export function CircularText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const id = "Elevazio-circular-path";
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <path
          id={id}
          d="M 100,100 m -76,0 a 76,76 0 1,1 152,0 a 76,76 0 1,1 -152,0"
          fill="none"
        />
      </defs>
      <text
        className="fill-ink-light font-display text-[15px] font-semibold uppercase"
        style={{ letterSpacing: "0.16em" }}
      >
        <textPath href={`#${id}`}>{text}</textPath>
      </text>
    </svg>
  );
}

/**
 * Fine architectural line art used as a decorative watermark inside the contact
 * card. Drawn as strokes only so it reads as a drafting sketch at low opacity
 * without competing with the form.
 */
export function BuildingLineArt({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 240 320"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      {/* Left tower */}
      <path d="M10 320V96h74v224" />
      <path d="M10 96 47 60l37 36" />
      <path d="M47 60V28" />
      <path d="M22 128h20v18H22zM52 128h20v18H52zM22 162h20v18H22zM52 162h20v18H52zM22 196h20v18H22zM52 196h20v18H52zM22 230h20v18H22zM52 230h20v18H52z" />
      <path d="M22 264h20v18H22zM52 264h20v18H52z" />
      {/* Right tower */}
      <path d="M104 320V44h88v276" />
      <path d="M104 44h88" />
      <path d="M116 68h20v16h-20zM148 68h20v16h-20zM116 98h20v16h-20zM148 98h20v16h-20zM116 128h20v16h-20zM148 128h20v16h-20zM116 158h20v16h-20zM148 158h20v16h-20zM116 188h20v16h-20zM148 188h20v16h-20zM116 218h20v16h-20zM148 218h20v16h-20z" />
      <path d="M126 244h44v18h-44zM126 276h44v18h-44z" />
      {/* Low wing */}
      <path d="M192 320V188h38v132" />
      <path d="M202 208h18v14h-18zM202 236h18v14h-18zM202 264h18v14h-18z" />
      <path d="M0 320h240" />
    </svg>
  );
}

const socialPaths: Record<string, ReactNode> = {
  facebook: (
    <path d="M13.5 8.5h-2A1.5 1.5 0 0 0 10 10v2.5H7.5V16H10v9.5h3.5V16h2.5l.5-3.5h-3V11a1 1 0 0 1 1-1h2v-1.5Z" />
  ),
  instagram: (
    <>
      <path d="M12 2.6c3.1 0 3.5 0 4.7.07 1.14.05 1.76.24 2.17.4.55.21.94.47 1.35.88.41.41.67.8.88 1.35.16.41.35 1.03.4 2.17.06 1.2.07 1.6.07 4.7s0 3.5-.07 4.7c-.05 1.14-.24 1.76-.4 2.17a3.6 3.6 0 0 1-.88 1.35c-.41.41-.8.67-1.35.88-.41.16-1.03.35-2.17.4-1.2.06-1.6.07-4.7.07s-3.5 0-4.7-.07c-1.14-.05-1.76-.24-2.17-.4a3.6 3.6 0 0 1-1.35-.88 3.6 3.6 0 0 1-.88-1.35c-.16-.41-.35-1.03-.4-2.17C2.61 15.5 2.6 15.1 2.6 12s0-3.5.07-4.7c.05-1.14.24-1.76.4-2.17.21-.55.47-.94.88-1.35.41-.41.8-.67 1.35-.88.41-.16 1.03-.35 2.17-.4C8.5 2.61 8.9 2.6 12 2.6Zm0 1.9c-3.03 0-3.4 0-4.57.07-.98.04-1.5.2-1.86.34-.47.18-.8.4-1.15.75-.35.35-.57.68-.75 1.15-.14.36-.3.88-.34 1.86C3.25 8.7 3.25 9.07 3.25 12s0 3.3.08 4.47c.04.98.2 1.5.34 1.86.18.47.4.8.75 1.15.35.35.68.57 1.15.75.36.14.88.3 1.86.34 1.17.08 1.54.08 4.57.08s3.4 0 4.57-.08c.98-.04 1.5-.2 1.86-.34.47-.18.8-.4 1.15-.75.35-.35.57-.68.75-1.15.14-.36.3-.88.34-1.86.08-1.17.08-1.54.08-4.47s0-3.3-.08-4.47c-.04-.98-.2-1.5-.34-1.86a3.1 3.1 0 0 0-.75-1.15 3.1 3.1 0 0 0-1.15-.75c-.36-.14-.88-.3-1.86-.34C15.4 4.5 15.03 4.5 12 4.5Zm0 3.06a4.44 4.44 0 1 1 0 8.88 4.44 4.44 0 0 1 0-8.88Zm0 7.33a2.89 2.89 0 1 0 0-5.78 2.89 2.89 0 0 0 0 5.78Zm5.66-7.5a1.04 1.04 0 1 1-2.08 0 1.04 1.04 0 0 1 2.08 0Z" />
    </>
  ),
  linkedin: (
    <path d="M5.2 8.6H2.4V21h2.8V8.6ZM3.8 3.4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM21.6 13.7c0-3-1.6-4.4-3.8-4.4-1.7 0-2.5 1-2.9 1.6V8.6H12V21h2.8v-6.5c0-1.7.6-2.7 1.9-2.7 1.2 0 1.7.9 1.7 2.7V21h2.8l.4-7.3Z" />
  ),
  x: (
    <path d="M3 3h4.3l4.5 6 5.1-6H19l-6.1 7.4L20 21h-4.3l-5-6.7L5.2 21H3.3l6.6-8L3 3Zm3 1.5 11 15h1.3L7.3 4.5H6Z" />
  ),
};

/** Minimal monochrome brand glyphs (lucide dropped brand icons). */
export function SocialIcon({
  name,
  className,
}: {
  name: keyof typeof socialPaths;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      {socialPaths[name]}
    </svg>
  );
}

