import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms that govern use of this website and any preliminary figures shared through it.",
  alternates: { canonical: "/terms" },
};

const sections = [
  {
    number: "01",
    heading: "Using this website",
    body: [
      "The content on this site is provided for general information. You may browse, print and share it for your own use, but you may not republish it or use it to build a competing product without written permission.",
    ],
  },
  {
    number: "02",
    heading: "Figures and availability",
    body: [
      "Unit counts, floor areas, completion dates, yields and any other figure shown are indicative. They are not an offer and are subject to change as planning, engineering and market conditions evolve.",
      "Nothing on this site constitutes investment, legal or tax advice. Speak to a licensed adviser before acting on anything you read here.",
    ],
  },
  {
    number: "03",
    heading: "Intellectual property",
    body: [
      `The ${siteConfig.legalName} name, wordmark, imagery, photography and written content are owned by the company and protected by copyright. Unauthorised reproduction is not permitted.`,
    ],
  },
  {
    number: "04",
    heading: "Enquiries and quotations",
    body: [
      "Submitting the enquiry form does not create a contract, a reservation or a commitment on either side. Formal appointments are only established once a written agreement has been signed by both parties.",
    ],
  },
  {
    number: "05",
    heading: "Liability",
    body: [
      "We take care to keep this site accurate, but we do not warrant that it is error free. To the extent permitted by law, we are not liable for decisions made solely on the basis of information published here.",
    ],
  },
  {
    number: "06",
    heading: "Governing law",
    body: [
      "These terms are governed by the laws of the Province of Ontario, Canada, and any dispute will be handled by the courts of that province.",
    ],
  },
];

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="legal"
      title="Terms & conditions"
      intro={`Last updated 1 March 2025. These terms govern your use of the ${siteConfig.name} website.`}
      image="/images/blog/blog_07.jpg"
      imageAlt="Elevazio office development"
    >
      <section className="py-15 sm:py-25 lg:py-37.5">
        <Container>
          {/* Intro */}
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.5fr)] lg:gap-20">
            <Reveal amount={0.4}>
              <Eyebrow>the detail</Eyebrow>
            </Reveal>

            <Reveal delay={0.08} amount={0.3}>
              <p className="max-w-3xl font-display text-h4 leading-[1.08] text-accent">
                Please read these terms carefully before using the Elevazio
                website.
              </p>
            </Reveal>
          </div>

          {/* Terms */}
          <div className="mt-16 border-t border-line lg:mt-24">
            {sections.map((section, index) => (
              <Reveal
                key={section.heading}
                delay={index * 0.04}
                amount={0.2}
              >
                <article
                  className="
                    grid gap-6
                    border-b border-line
                    py-10
                    sm:py-12
                    lg:grid-cols-[8rem_minmax(0,1fr)]
                    lg:gap-10
                    lg:py-14
                  "
                >
                  {/* Number */}
                  <div className="font-display text-caption font-semibold uppercase tracking-[0.12em] text-ink-light">
                    {section.number}
                  </div>

                  {/* Content */}
                  <div className="max-w-3xl">
                    <h2 className="font-display text-h4 leading-[1.08] text-accent">
                      {section.heading}
                    </h2>

                    <div className="mt-5 space-y-4">
                      {section.body.map((paragraph, paragraphIndex) => (
                        <p
                          key={`${section.heading}-${paragraphIndex}`}
                          className="text-body leading-relaxed text-ink-light"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Footer note */}
          <Reveal
            delay={0.1}
            className="mt-12 flex flex-col gap-4 border-l-2 border-primary pl-6 sm:flex-row sm:items-start sm:justify-between"
          >
            <div>
              <p className="font-display text-body-sm font-semibold text-accent">
                Questions about these terms?
              </p>

              <p className="mt-1 max-w-xl text-body-sm text-ink-light">
                If you need clarification about anything on this page, please
                contact the Elevazio team before relying on the information
                provided.
              </p>
            </div>

            <a
              href="/contact"
              className="
                shrink-0
                font-display text-caption font-semibold uppercase
                tracking-[0.08em] text-accent
                underline decoration-primary decoration-2
                underline-offset-4
                transition-colors duration-300
                hover:text-primary
              "
            >
              Contact us
            </a>
          </Reveal>
        </Container>
      </section>
    </PageShell>
  );
}