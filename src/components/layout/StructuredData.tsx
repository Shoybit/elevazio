import { siteConfig } from "@/config/site";
import { services } from "@/config/services";

/**
 * Organization + WebSite structured data. Rendered once, inline, so search
 * engines can parse the brand, contact points and primary navigation without a
 * second network request.
 */
export function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.legalName,
        alternateName: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        logo: `${siteConfig.url}/images/brand/elevazio-wordmark.png`,
        email: siteConfig.email,
        telephone: siteConfig.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.address.street,
          addressLocality: siteConfig.address.city,
          addressRegion: siteConfig.address.region,
          postalCode: siteConfig.address.postalCode,
          addressCountry: siteConfig.address.country,
        },
        sameAs: siteConfig.social.map((item) => item.href),
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            telephone: siteConfig.phone,
            email: siteConfig.email,
            areaServed: "Worldwide",
            availableLanguage: ["English"],
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: { "@id": `${siteConfig.url}/#organization` },
        inLanguage: "en",
      },
      {
        "@type": "ItemList",
        "@id": `${siteConfig.url}/#services`,
        name: "Services",
        itemListElement: services.map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: service.title,
          description: service.summary,
          url: `${siteConfig.url}${service.href}`,
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Content is a static, developer-authored object — no user input involved.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
