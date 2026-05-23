"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import { Category, Project } from "@/lib/types";
import { ProjectCard } from "@/components/project-card";
import { cn } from "@/lib/utils";

interface ProjectsSectionProps {
  initialData?: Project[];
  categories?: Category[];
}

export function ProjectsSection({
  initialData = [],
  categories = [],
}: ProjectsSectionProps) {
  const [activeTab, setActiveTab] = useState("all");

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      const data = await res.json();
      return data.data as Project[];
    },
    initialData,
    staleTime: 1000 * 60 * 5,
  });

  const tabs = [
    { id: "all", label: "All" },
    ...categories.map((cat) => ({
      id: cat.name,
      label: cat.name,
    })),
  ];

  const filteredProjects = projects.filter((project) => {
    if (activeTab === "all") return true;

    if (Array.isArray(project.category)) {
      return project.category.includes(activeTab);
    }

    return project.category === activeTab;
  });

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-wrap gap-7 md:justify-end">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "editorial-label border-b border-transparent pb-1 text-muted-foreground transition-colors hover:text-foreground",
              activeTab === tab.id && "border-foreground text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="border border-border py-20 text-center text-muted-foreground">
              No projects found in this category.
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
