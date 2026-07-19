"use client";

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

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-0 sm:px-0 lg:grid-cols-2 lg:gap-6">
          {projects
            .filter((p) => p.featured)
            .map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
        </div>
      </div>
    </section>
  );
}
