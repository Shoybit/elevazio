import type { LucideIcon } from "lucide-react";
import { BadgeCheck, Gem, Handshake } from "lucide-react";

export interface HeroFeature {
  title: string;
  description: string;
  icon: LucideIcon;
  /**
   * Optional architectural still bled into the card's right edge. Chosen to
   * share the hero's dusk-and-blue tonality so the row reads as one scene.
   */
  image?: string;
}

export const heroFeatures: HeroFeature[] = [
  {
    title: "Elevated Luxury",
    description:
      "Exquisite design and refined details create a seamless, sophisticated living experience.",
    icon: Gem,
    image: "/images/projects/project-05.jpg",
  },
  {
    title: "Dedicated Service",
    description:
      "24/7 support ensuring residents receive prompt assistance and reliable information.",
    icon: BadgeCheck,
    image: "/images/projects/project-09.jpg",
  },
  {
    title: "True Partnership",
    description:
      "We partner with investors and developers to create landmark projects with lasting impact.",
    icon: Handshake,
    image: "/images/projects/project-02.jpg",
  },
];

export interface Stat {
  label: string;
  value: number;
  suffix: string;
  caption: string;
}

export const stats: Stat[] = [
  { label: "global presence", value: 96, suffix: "+", caption: "offices worldwide" },

  {
    label: "industry expertise",
    value: 2000,
    suffix: "+",
    caption: "skilled professionals",
  },

  { label: "lasting impact", value: 250, suffix: "+", caption: "projects delivered" },
];

export interface Pillar {
  title: string;
  description: string;
}

export const introPillars: Pillar[] = [
  {
    title: "Develop the sites others walk past.",
    description:
      "We acquire, entitle and build on the neighbourhoods with the strongest long-term fundamentals — and hold each one to the same standard.",
  },
  {
    title: "One in-house team, from sketch to handover.",
    description:
      "3,000+ professionals across residential, commercial and mixed-use delivery, so accountability never changes hands mid-project.",
  },
];
