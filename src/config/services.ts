export interface Service {
  id: string;
  title: string;
  summary: string;
  image: string;
  href: string;
}

export const services: Service[] = [
  {
  id: "development",
  title: "Real Estate Development",
  summary:
    "Transforming strategic opportunities into landmark communities designed for lasting value and enduring impact.",
  image: "/images/services/service_01_d.png",
  href: "/services#development",
},

{
  id: "management",
  title: "Project Management",
  summary:
    "End-to-end project delivery with precise coordination, transparent reporting, and uncompromising attention to detail.",
  image: "/images/services/service_02.png",
  href: "/services#management",
},

{
  id: "investment",
  title: "Investment & Capital",
  summary:
    "Strategic capital deployment through transparent structures built to create sustainable, long-term value.",
  image: "/images/services/service_03.png",
  href: "/services#investment",
},

{
  id: "construction",
  title: "Construction Management",
  summary:
    "Expert site management, disciplined execution, and rigorous standards bringing every vision to life.",
  image: "/images/services/service_04.png",
  href: "/services#construction",
},

{
  id: "architecture",
  title: "Architecture & Design",
  summary:
    "Thoughtful architecture and inspired design creating distinctive spaces that connect people and place.",
  image: "/images/services/service_05.png",
  href: "/services#architecture",
},
];
