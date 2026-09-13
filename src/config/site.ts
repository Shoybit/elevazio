export const siteConfig = {
  name: "Elevazio",
  legalName: "Elevazio Group",
  tagline: "Real Estate & Construction Group",
  description:
    "Elevazio is a top-25 privately held real estate developer and builder. We develop landmark residential and commercial projects that deliver lasting value to investors and communities.",
  url: "https://elevazio.example.com",
  locale: "en_US",
  phone: "+1 (800) 123-4567",
  phoneHref: "tel:+18001234567",
  email: "elevazio@yourwebsite.com",
  address: {
    street: "221 Harbour Street, Suite 1400",
    city: "Toronto",
    region: "ON",
    postalCode: "M5J 2W7",
    country: "Canada",
  },
  social: [
    { label: "Facebook", icon: "facebook", href: "https://facebook.com" },
    { label: "Instagram", icon: "instagram", href: "https://instagram.com" },
    { label: "LinkedIn", icon: "linkedin", href: "https://linkedin.com" },
    { label: "X", icon: "x", href: "https://x.com" },
  ] as const,
} as const;

export type SiteConfig = typeof siteConfig;
