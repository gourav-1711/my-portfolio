"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Code2, Maximize2, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const primaryCategory = Array.isArray(project.category)
    ? project.category[0]
    : project.category;

  return (
    <>
      <article className="group flex h-full flex-col">
        <div className="relative aspect-[4/5] overflow-hidden border border-border bg-card">
          <img
            src={project.img}
            alt={project.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/10" />

          {primaryCategory && (
            <Badge
              variant="outline"
              className="absolute right-4 top-4 bg-background/80 text-foreground"
            >
              {primaryCategory}
            </Badge>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute left-4 top-4 flex size-10 items-center justify-center border border-border bg-background/80 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            title="View Full Image"
          >
            <Maximize2 className="size-4" />
          </button>
        </div>

        <div className="flex flex-1 flex-col pt-6">
          <h3 className="font-serif text-3xl font-semibold leading-tight text-foreground">
            {project.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-base leading-7 text-muted-foreground">
            {project.description}
          </p>

          {project.tags && project.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {project.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-auto flex gap-8 pt-7">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-label flex items-center gap-2 text-foreground hover:underline"
              >
                Live Demo <ArrowUpRight className="size-3" />
              </a>
            )}

            <a
              href={project.githubUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-label flex items-center gap-2 text-foreground hover:underline"
            >
              View Code <Code2 className="size-3" />
            </a>
          </div>
        </div>
      </article>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 p-4 md:p-8"
                onClick={() => setIsModalOpen(false)}
              >
                <div className="relative flex max-h-[90vh] w-full max-w-6xl flex-col items-center">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute -top-14 right-0 flex size-11 items-center justify-center border border-border text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <X className="size-5" />
                  </button>
                  <motion.img
                    initial={{ scale: 0.98 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.98 }}
                    src={project.img}
                    alt={project.title}
                    className="max-h-[80vh] w-auto border border-border object-contain grayscale"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <h3 className="mt-5 text-center font-serif text-3xl font-semibold text-foreground">
                    {project.title}
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
