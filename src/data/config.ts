import { Github, Instagram, Linkedin, type LucideIcon } from "lucide-react";

export interface Social {
  name: string;
  url: string;
  icon: LucideIcon;
}

export const socials: Social[] = [
  {
    name: "GitHub",
    url: "https://github.com/ramideltoro",
    icon: Github,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/ramideltoro/",
    icon: Linkedin,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/rami_deltoro/",
    icon: Instagram,
  },
];

export const siteConfig = {
  name: "Rami Del Toro",
  title: "Software Engineer",
  description: "I build useful products across web, mobile, cloud, and AI.",
};
