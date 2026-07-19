export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
  deviceType: "desktop" | "mobile";
  bgColor?: string;
  screenshots?: string[];
}

export const projects: Project[] = [
  {
    id: "project-alpha",
    title: "NutsNews",
    description: "A positive news platform built to make staying informed feel lighter.",
    tags: ["Next.js", "AI", "News"],
    featured: true,
    deviceType: "desktop",
    bgColor: "bg-linear-to-br from-violet-500/90 to-fuchsia-500/90",
    screenshots: [
      "/projects/nutsnews.png",
    ],
  },
  {
    id: "project-beta",
    title: "NutsNews iOS app",
    description: "A native iOS news reader that turns long articles into quick, useful summaries.",
    tags: ["iOS", "Swift", "AI"],
    featured: true,
    deviceType: "mobile",
    bgColor: "bg-linear-to-br from-blue-500/90 to-cyan-500/90",
    screenshots: [
      "/projects/nutsnews-ios-main.png",
      "/projects/nutsnews-ios-right.png",
      "/projects/nutsnews-ios-left.png",
    ],
  },
  {
    id: "project-gamma",
    title: "ShowAlgo",
    description: "A programming blog where I break down algorithms, data structures, and coding problems.",
    tags: ["Algorithms", "Writing", "Education"],
    featured: true,
    deviceType: "desktop",
    bgColor: "bg-linear-to-br from-emerald-500/90 to-teal-500/90",
    screenshots: [
      "/projects/showalgo.png",
    ],
  },
  {
    id: "project-delta",
    title: "Force For Good",
    description: "Technical architect work for The ALS Association's volunteer platform strategy, design, and implementation.",
    tags: ["Architecture", "Nonprofit", "Platform"],
    featured: true,
    deviceType: "desktop",
    bgColor: "bg-linear-to-br from-purple-500/90 to-pink-500/90",
    screenshots: [
      "/projects/force-for-good.png",
    ],
  },
];
