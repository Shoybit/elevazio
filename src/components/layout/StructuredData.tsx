import { siteConfig } from "@/config/site";
import { services } from "@/config/services";

/**
 * Serialises the graph for inline embedding.
 *
 * `JSON.stringify` alone is not sufficient inside a `<script>` element: a
 * string containing a closing script tag would terminate the element early,
 * and an HTML comment opener would swallow the rest of the document.
 * Rewriting every `<` as its JSON unicode escape keeps the payload valid JSON
 * (JSON treats `<` as an ordinary character) while making both sequences
 * unrepresentable, which closes the stored-XSS vector for schema.org values
 * that are ever sourced from a CMS.
 */
function toJsonLd(graph: unknown): string {
  return JSON.stringify(graph).replace(/</g, "\\u003c");
}

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
      // Serialised from a static, developer-authored object; `toJsonLd` escapes
      // every `<` so no value can break out of the script element.
      dangerouslySetInnerHTML={{ __html: toJsonLd(graph) }}
    />
  );
}
