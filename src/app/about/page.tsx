import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import {
  AboutNumbers,
  AboutPrinciples,
  AboutTrackRecord,
} from "@/components/sections/About/AboutContent";
import {
  AboutCareers,
  AboutTeam,
} from "@/components/sections/About/AboutTeam";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Elevazio is a top-25 privately held developer. Meet the people, principles and track record behind three decades of landmark real estate delivery.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="who we are"
      title="Building the places people want to live and invest in"
      intro="Three decades of disciplined delivery across residential, commercial and mixed-use schemes — with the same in-house team from first sketch to final handover."
      image="/images/blog/blog_03.jpg"
      imageAlt="Elevazio residential tower"
    >
      <AboutPrinciples />
      <AboutNumbers />
      <AboutTrackRecord />
      <AboutTeam />
      <AboutCareers />
    </PageShell>
  );
}
