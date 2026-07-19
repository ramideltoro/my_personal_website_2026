"use client";

import { motion } from "framer-motion";
import { Code2, ExternalLink, Newspaper, Smartphone, Youtube, type LucideIcon } from "lucide-react";

type LinkItem = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string;
};

const linkItems: LinkItem[] = [
  {
    title: "NutsNews",
    description: "Positive news platform built to make staying informed feel lighter.",
    href: "https://www.nutsnews.com",
    icon: Newspaper,
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    title: "ShowAlgo",
    description: "Educational programming blog for algorithms, data structures, and coding problems.",
    href: "https://www.showalgo.com",
    icon: Code2,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "NutsNews iOS app",
    description: "Native iOS news reader that turns articles into bite-sized insights.",
    href: "https://apps.apple.com/us/app/nutsnews/id6782165732",
    icon: Smartphone,
    color: "from-indigo-500 to-purple-500",
  },
  {
    title: "The ALS Association Florida Chapter Project",
    description: "Video overview of nonprofit platform work with The ALS Association Florida Chapter.",
    href: "https://www.youtube.com/watch?v=y0phC3DjIJw",
    icon: Youtube,
    color: "from-rose-500 to-red-500",
  },
];

export function Other() {
  return (
    <section
      id="links"
      className="relative overflow-hidden pt-0 pb-24 sm:pb-32"
      style={{ scrollMarginTop: "120px" }}
    >
      <div className="section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 px-2 text-4xl font-bold text-pretty sm:text-6xl md:text-7xl">
            <span className="text-gradient-shimmer">Links</span>
          </h2>
          <p className="mx-auto max-w-2xl px-3 text-base text-(--muted) sm:text-lg">
            A few places to see what I am building across the web and iOS.
          </p>
        </motion.div>

        <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:gap-5">
          {linkItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                whileHover={{ y: -5 }}
                className="group glass relative flex items-center gap-4 overflow-hidden rounded-3xl p-4 transition-colors duration-300 hover:border-purple-400/35 sm:gap-6 sm:p-6"
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${item.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
                />
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-purple-400/45 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className={`relative z-10 h-14 w-14 shrink-0 rounded-2xl bg-linear-to-br ${item.color} p-0.5 sm:h-16 sm:w-16`}>
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-(--background)">
                    <Icon size={28} className="text-(--foreground) sm:size-8" />
                  </div>
                </div>

                <div className="relative z-10 min-w-0 flex-1">
                  <h3 className="text-xl font-bold leading-tight text-(--foreground) sm:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-(--muted) sm:text-base">
                    {item.description}
                  </p>
                </div>

                <ExternalLink
                  size={22}
                  className="relative z-10 shrink-0 text-(--muted) transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-(--foreground)"
                  aria-hidden="true"
                />
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
