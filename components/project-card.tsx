import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Github, Maximize2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default gradient if none provided
  const gradient = project.gradient || "from-purple-500 to-pink-500";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative h-full flex flex-col bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10"
      >
        {/* 1. MEDIA CONTAINER - Fixed Aspect Ratio */}
        <div className="relative w-full aspect-video bg-gray-900 overflow-hidden">
          {/* Blurred Background for 9:16 images */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-xl opacity-40 scale-110"
            style={{ backgroundImage: `url(${project.img})` }}
          />

          {/* Main Image - Contained */}
          <img
            src={project.img}
            alt={project.title}
            className="relative z-10 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
          />

          {/* Floating Tags - Top Right */}
          <div className="absolute top-3 right-3 z-20 flex flex-wrap justify-end gap-1.5 max-w-[70%]">
            {project.tags?.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 text-[10px] font-medium rounded-md bg-black/60 backdrop-blur-md text-white/90 border border-white/10 shadow-sm"
              >
                {tag}
              </span>
            ))}
            {project.tags && project.tags.length > 3 && (
              <span className="px-2 py-1 text-[10px] font-medium rounded-md bg-black/60 backdrop-blur-md text-white/90 border border-white/10 shadow-sm">
                +{project.tags.length - 3}
              </span>
            )}
          </div>

          {/* Lens Icon - Top Left */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute top-3 left-3 z-20 p-2 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-white/80 hover:text-white border border-white/10 transition-all duration-300 hover:scale-110"
            title="View Full Image"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* 2. CONTENT CONTAINER */}
        <div className="p-5 flex flex-col flex-1 gap-3">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
              {project.title}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2 mt-1 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* 3. DYNAMIC FOOTER */}
          <div className="flex gap-3 mt-auto pt-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-purple-500/20",
                  "bg-gradient-to-r",
                  gradient,
                )}
              >
                Live Demo <ArrowUpRight className="w-4 h-4" />
              </a>
            )}

            <a
              href={project.githubUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white transition-all duration-300",
                project.liveUrl ? "flex-1" : "w-full",
              )}
            >
              <Github className="w-4 h-4" />
              {project.liveUrl ? "Code" : "View Code"}
            </a>
          </div>
        </div>
      </motion.div>

      {/* Full Image Modal - Portal to Body */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-8"
                onClick={() => setIsModalOpen(false)}
              >
                <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col items-center">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
                  >
                    <X className="w-8 h-8" />
                  </button>
                  <motion.img
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    src={project.img}
                    alt={project.title}
                    className="max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <h3 className="text-white text-xl font-medium mt-4 text-center">
                    {project.description}
                  </h3>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
