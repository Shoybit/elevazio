import type { Metadata } from "next";
import "./globals.css";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { involve, switzer } from "@/styles/fonts";
import { siteConfig } from "@/config/site";

/** Social share card. Must resolve to a file that exists in `public/`. */
const OG_IMAGE = "/images/hero/hero_bg_demo.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} – ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "real estate developer",
    "construction group",
    "architecture firm",
    "residential development",
    "commercial buildings",
    "property investment",
  ],
  authors: [{ name: siteConfig.legalName }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} – ${siteConfig.tagline}`,
    description: siteConfig.description,
    locale: siteConfig.locale,
    images: [
      {
        url: OG_IMAGE,
        width: 1920,
        height: 1080,
        alt: `${siteConfig.name} — landmark real estate development`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} – ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport = {
  themeColor: "#E4ED64",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // No `suppressHydrationWarning`: the font class names come from a build-time
    // hash and are identical on both sides of hydration, and every other value
    // here is static. Suppressing it would only hide a real mismatch if one
    // were ever introduced.
    <html lang="en" className={`${switzer.variable} ${involve.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col bg-canvas">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-100 focus:rounded-full focus:bg-accent focus:px-6 focus:py-3 focus:font-display focus:text-sm focus:font-semibold focus:text-canvas"
        >
          Skip to main content
        </a>
        <MotionProvider>
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}