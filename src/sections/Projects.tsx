"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";

export function Projects() {
  return (
    <section
      id="projects"
      className="relative overflow-hidden pt-0 pb-32"
      style={{ scrollMarginTop: "120px" }}
    >
      <div className="section">
        <div className="mb-20 text-center">
          <h2 className="px-2 text-3xl font-bold tracking-tight text-pretty sm:text-5xl md:text-6xl">
            Featured{" "}
            <span className="text-gradient-shimmer">Projects</span>
          </h2>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
          {projects
            .filter((p) => p.featured)
            .map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <a
            href="https://github.com/Szostak21?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="group mx-auto inline-flex max-w-[min(100%,22rem)] items-center gap-2 px-2 text-center text-sm font-semibold text-(--accent) transition-colors hover:text-(--accent-hover) sm:max-w-none sm:gap-3 sm:text-lg"
          >
            <span>See all projects on GitHub</span>
            <ExternalLink
              size={20}
              className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
