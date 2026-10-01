import type { Metadata } from "next";

import { PageShell } from "@/components/layout/PageShell";
import { NewsFeed } from "@/components/sections/News/NewsFeed";
import { posts } from "@/config/team";

export const metadata: Metadata = {
  title: "News & Insights",
  description:
    "Field notes, market briefings and design writing from the Elevazio development, investment and architecture teams.",
  alternates: { canonical: "/news" },
};

export default function NewsPage() {
  return (
    <PageShell
      eyebrow="Articles & insights"
      title="Notes from the site, the studio and the market"
      intro="Written by the people doing the work — updates on delivery, design decisions and the numbers behind the deals."
      image="/images/blog/blog_06.jpg"
      imageAlt="Colourful residential architecture"
    >
      <NewsFeed posts={posts} />
    </PageShell>
  );
}
