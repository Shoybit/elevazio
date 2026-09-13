export type ProjectCategory = "Residential" | "Mixed use" | "Commercial";

export interface Project {
  id: string;
  index: string;
  title: string;
  location: string;
  year: string;
  image: string;
  /** Shown as the badge on the project card. Lives here so it cannot drift. */
  category: ProjectCategory;
}

export const projects: Project[] = [
  {
    id: "skyline-residences",
    index: "01",
    title: "Skyline Residences",
    location: "Toronto, ON",
    year: "2023",
    image: "/images/projects/apartment-08.jpg",
    category: "Residential",
  },
  {
    id: "oakwood-estate",
    index: "02",
    title: "Oakwood Estate",
    location: "Dallas, TX",
    year: "2022",
    image: "/images/projects/project-06.jpg",
    category: "Residential",
  },
  {
    id: "grandview-square",
    index: "03",
    title: "Grandview Square",
    location: "Chicago, IL",
    year: "2021",
    image: "/images/projects/project-05.jpg",
    category: "Mixed use",
  },
  {
    id: "central-business-hub",
    index: "04",
    title: "Central Business Hub",
    location: "New York, NY",
    year: "2020",
    image: "/images/projects/apartment-09.jpg",
    category: "Commercial",
  },
];
