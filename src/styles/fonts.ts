import localFont from "next/font/local";

/**
 * Body typeface — Switzer (400 / 600).
 */
export const switzer = localFont({
  src: [
    { path: "../assets/fonts/Switzer-Regular.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/Switzer-Semibold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-switzer",
  display: "swap",
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
  adjustFontFallback: false,
});

/**
 * Display typeface — Involve (600 / 700). All headings and UI labels.
 */
export const involve = localFont({
  src: [
    { path: "../assets/fonts/Involve-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../assets/fonts/URWGothicL-Demi.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-involve",
  display: "swap",
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
  adjustFontFallback: false,
});
