/**
 * Single source of truth for brand, contact and canonical-URL data.
 *
 * Everything here is safe to ship to the browser: the only environment
 * variable consumed is `NEXT_PUBLIC_SITE_URL`, which is the public origin of
 * the deployed site. Never prefix anything secret with `NEXT_PUBLIC_` — those
 * values are inlined into the client bundle.
 */

/** Canonical origin used when `NEXT_PUBLIC_SITE_URL` is unset. */
const DEFAULT_SITE_URL = "https://elevazio.com";

/**
 * Normalises the configured origin, or falls back to the brand default.
 *
 * `metadataBase` throws on a malformed URL, so a typo in a deployment variable
 * would otherwise take down every route. Validating once here keeps that
 * failure soft and keeps `sitemap.xml` / `robots.txt` / JSON-LD ids consistent.
 */
function resolveSiteUrl(raw: string | undefined): string {
  if (!raw) return DEFAULT_SITE_URL;
  try {
    return new URL(raw).origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const siteConfig = {
  name: "Elevazio",
  legalName: "Elevazio Group",
  tagline: "Real Estate & Construction Group",
  description:
    "Elevazio is a top-25 privately held real estate developer and builder. We develop landmark residential and commercial projects that deliver lasting value to investors and communities.",
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  locale: "en_US",
  phone: "+1 (800) 123-4567",
  phoneHref: "tel:+18001234567",
  email: "hello@elevazio.com",
  address: {
    street: "221 Harbour Street, Suite 1400",
    city: "Toronto",
    region: "ON",
    postalCode: "M5J 2W7",
    country: "Canada",
  },
  social: [
    { label: "Facebook", href: "https://www.facebook.com" },
    { label: "Instagram", href: "https://www.instagram.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com" },
    { label: "X", href: "https://x.com" },
  ] as const,
} as const;

export type SiteConfig = typeof siteConfig;
