import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy.
 *
 * A nonce-based policy would be stricter, but nonces force dynamic rendering
 * and would give up static generation, CDN caching and the sub-second TTFB the
 * site is built around — a poor trade for a fully static marketing site with no
 * user-generated content. This static policy is the "without nonces" form
 * Next.js documents for exactly that case.
 *
 * Notes on the two `unsafe-inline` entries:
 *
 * - `script-src` — Next.js emits inline bootstrap/hydration scripts. Removing
 *   it breaks the app outright, so it stays; the meaningful XSS protection
 *   here is `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`
 *   and a `default-src` that refuses everything not listed.
 * - `style-src-attr` — Motion writes every animated transform as an inline
 *   `style` attribute. `style-src-attr` (CSP3) is scoped to attributes, so
 *   this does not re-open `<style>`/`style-src`.
 *
 * Every source is same-origin: fonts are self-hosted, imagery is local and
 * there are no third-party scripts, embeds or analytics. `connect-src` needs
 * `ws:`/`wss:` in development for the HMR socket only.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // Stylesheets are external; only the `style` *attribute* needs relaxing.
  "style-src 'self'",
  "style-src-attr 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
].join("; ");

/**
 * Baseline response hardening.
 *
 * `X-Frame-Options` is set alongside the CSP `frame-ancestors` directive
 * because it is the only one of the two understood by older user agents.
 * HSTS is deliberately left to the hosting layer: it is only honoured over
 * HTTPS, and hard-coding it here would brick a plain-HTTP preview host.
 */
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    // Nothing on this site needs camera, microphone, geolocation or payments.
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 375, 414, 640, 768, 1024, 1280, 1536, 1920, 2560],
    imageSizes: [64, 96, 128, 200, 256, 384, 512],
    // No `remotePatterns`: every image is served from `public/`, so there is no
    // host allow-list to widen and no SSRF surface for the optimiser.
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/:path*.(woff2|svg|png|jpg|jpeg|webp|avif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
