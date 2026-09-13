export interface TeamMember {
  name: string;
  role: string;
  image: string;
  maskImage: string;
}

export const team: TeamMember[] = [
  // {
  //   name: "Dennis Daniels",
  //   role: "Founder & CEO",
  //   image: "/images/team/team_01_no_mask.png",
  //   maskImage: "/images/team/team_01_mask.png",
  // },
  // {
  //   name: "Johan Sanford",
  //   role: "Executive Assistant",
  //   image: "/images/team/team_02_no_mask.png",
  //   maskImage: "/images/team/team_02_mask.png",
  // },
  // {
  //   name: "Floyd Miles",
  //   role: "Director of Architecture",
  //   image: "/images/team/team_03_no_mask.png",
  //   maskImage: "/images/team/team_03_mask.png",
  // },
  {
    name: "Leslie Alexander",
    role: "Development Manager",
    image: "/images/team/team_04_no_mask.png",
    maskImage: "/images/team/team_04_mask.png",
  },
  {
    name: "Bernardo Gordon",
    role: "Operations Manager",
    image: "/images/team/team_05_no_mask.png",
    maskImage: "/images/team/team_05_mask.png",
  },
  {
    name: "Ralph Edwards",
    role: "Construction Manager",
    image: "/images/team/team_06_no_mask.png",
    maskImage: "/images/team/team_06_mask.png",
  },
];
export interface Post {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
}

export const posts: Post[] = [
  {
    slug: "sustainable-cities",
    title: "Sustainable Cities: A Greener Future",
    category: "Innovation",
    date: "March 18, 2025",
    readTime: "6 min read",
    image: "/images/blog/blog_04.jpg",
    excerpt:
      "How massing, orientation and material selection cut operational energy by up to 40% without asking residents to compromise on comfort.",
  },
  {
    slug: "real-estate-investment-basics",
    title: "Real Estate Investment Basics",
    category: "Investment",
    date: "February 02, 2025",
    readTime: "8 min read",
    image: "/images/blog/blog_02.jpg",
    excerpt:
      "A plain-language walk through yield, basis points and exit assumptions — the three numbers every investor should check before committing.",
  },
  {
    slug: "biophilic-design",
    title: "Biophilic Design: Bringing Nature Indoors",
    category: "Design",
    date: "January 14, 2025",
    readTime: "5 min read",
    image: "/images/blog/blog_03.jpg",
    excerpt:
      "Daylight, planting and material texture are not decoration. They change how people feel, recover and stay in a building.",
  },
  {
    slug: "tiny-homes",
    title: "Tiny Homes: Big Benefits",
    category: "Trends",
    date: "December 09, 2024",
    readTime: "4 min read",
    image: "/images/blog/blog_01.jpg",
    excerpt:
      "Why the smallest units in a mixed-use scheme are often the hardest to make work — and the most valuable per square foot.",
  },
  {
    slug: "design-shapes-wellbeing",
    title: "How Design Shapes Well-Being",
    category: "Design",
    date: "November 21, 2024",
    readTime: "7 min read",
    image: "/images/blog/blog_05.jpg",
    excerpt:
      "Acoustic comfort, ceiling height and the position of a window quietly shape how a home feels. We measure all three on every scheme.",
  },
  {
    slug: "eco-friendly-construction",
    title: "Eco-Friendly Construction Trends",
    category: "Sustainability",
    date: "October 30, 2024",
    readTime: "9 min read",
    image: "/images/blog/blog_06.jpg",
    excerpt:
      "Low-carbon concrete, electric plant and circular formwork are becoming specification defaults rather than premium options.",
  },
];
