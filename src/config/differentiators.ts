import type { LucideIcon } from "lucide-react";
import { ShieldCheck, Users, Scale } from "lucide-react";

export interface Differentiator {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const differentiators: Differentiator[] = [
  {
    title: "Responsible by Design",
    description:
      "We go beyond creating value, combining thoughtful design, innovation, and collaboration to deliver remarkable experiences.",
    icon: ShieldCheck,
  },

  {
    title: "Expertise in Unity",
    description:
      "Our dedicated team works together to achieve exceptional results, with safety and excellence at the heart of every project.",
    icon: Users,
  },

  {
    title: "A Culture of Inclusion",
    description:
      "Our diverse team brings together varied perspectives and expertise to create innovative, forward-thinking solutions.",
    icon: Scale,
  },
];

export const clientNote =
  "We’re proud to partner with industry-leading clients";

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "“An exceptional experience from start to finish. Their expertise, professionalism, and attention to detail were evident throughout the entire process.”",
    name: "Daniel Mercer",
    role: "Managing Partner, Northline Capital",
    avatar: "/images/avatars/avatar-01.jpg",
  },

  {
    quote:
      "“The team was excellent to work with. They delivered with care and professionalism, and we look forward to working together on future projects.”",
    name: "Sophia Bennett",
    role: "Homeowner, Eden Estate",
    avatar: "/images/avatars/avatar-02.jpg",
  },

  {
    quote:
      "“They responded quickly and delivered outstanding results. The quality of the work was exceptional, and I would gladly recommend their team.”",
    name: "James Carter",
    role: "Facilities Lead, Councill Square",
    avatar: "/images/avatars/avatar-03.jpg",
  },
];
