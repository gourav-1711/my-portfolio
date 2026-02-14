"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Project, Category } from "@/lib/types";
import { ProjectCard } from "@/components/project-card";

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

  // Generate tabs: "All" + dynamic categories
  const tabs = [
    { id: "all", label: "All" },
    ...categories.map((cat) => ({
      id: cat.name, // Use name as ID for filtering since project stores category names
      label: cat.name,
    })),
  ];

  const filteredProjects = projects.filter((project) => {
    if (activeTab === "all") return true;

    // Check if the project's category array includes the active tab (category name)
    // Handle potential legacy data (string) or new data (array)
    if (Array.isArray(project.category)) {
      return project.category.includes(activeTab);
    }
    // Fallback if data is still a string (shouldn't happen with new projects but good for safety)
    return project.category === activeTab;
  });

  return (
    <div className="w-full space-y-8">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border ${
              activeTab === tab.id
                ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105"
                : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-7xl mx-auto px-4"
        >
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              No projects found in this category.
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
