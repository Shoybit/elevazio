import type { Metadata } from "next";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { StructuredData } from "@/components/layout/StructuredData";
import { BlogGrid } from "@/components/sections/BlogGrid";
import { Contact } from "@/components/sections/Contact";
import { Difference } from "@/components/sections/Difference";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Partners } from "@/components/sections/Partners";
import { ProjectsShowcase } from "@/components/sections/ProjectsShowcase";
import { Services } from "@/components/sections/Services";
import { Team } from "@/components/sections/Team";
import { Testimonials } from "@/components/sections/Testimonials";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <ScrollProgress />
      <SiteHeader />
      <main id="main">
        <Hero />
        <Intro />
        <Services />
        <ProjectsShowcase />
        <Difference />
        <Testimonials />
        <Partners />
        <Team />
        <Contact />
        <BlogGrid />
      </main>
      <SiteFooter />
    </>
  );
}
