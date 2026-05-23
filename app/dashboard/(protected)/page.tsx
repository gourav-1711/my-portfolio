"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Trash2,
  Loader2,
  LayoutGrid,
  List,
  Type,
  Search,
  Settings,
  Pencil,
  Github,
  ExternalLink,
} from "lucide-react";
import { AddProjectModal } from "@/components/dashboard/add-project-modal";
import { AddSkillModal } from "@/components/dashboard/add-skill-modal";
import CategoriesManager from "@/components/dashboard/categories-manager";
import HeroEditor from "@/components/dashboard/hero-form";
import SettingsContent from "@/components/dashboard/settings-content";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Project, Skill } from "@/lib/types";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "projects" | "skills" | "categories" | "hero" | "settings"
  >("projects");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const queryClient = useQueryClient();

  // --- Projects Data ---
  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      const data = await res.json();
      return data.data as Project[];
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // --- Skills Data ---
  const { data: skills, isLoading: isLoadingSkills } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const res = await fetch("/api/skills");
      const data = await res.json();
      return data.data as Skill[];
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/skills?id=${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  const TabButton = ({
    id,
    label,
    icon: Icon,
  }: {
    id: typeof activeTab;
    label: string;
    icon: any;
  }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "editorial-label flex items-center gap-2 border px-4 py-3 transition-all",
        activeTab === id
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-serif text-5xl font-semibold text-foreground">
            Dashboard
          </h1>
          <p className="mt-3 text-muted-foreground">
            Manage your portfolio content.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-3 border-b border-border pb-6">
        <TabButton id="projects" label="Projects" icon={LayoutGrid} />
        <TabButton id="skills" label="Skills" icon={List} />
        <TabButton id="categories" label="Categories" icon={Search} />
        <TabButton id="hero" label="Hero & About" icon={Type} />
        <TabButton id="settings" label="Settings" icon={Settings} />
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {/* PROJECTS TAB */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setEditingProject(null);
                  setIsProjectModalOpen(true);
                }}
                className="editorial-button"
              >
                <Plus data-icon="inline-start" /> Add Project
              </Button>
            </div>

            {isLoadingProjects ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-40 animate-pulse border border-border bg-card"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects?.map((project) => {
                  return (
                    <div
                      key={project.id}
                      className="group relative flex flex-col overflow-hidden border border-border bg-card transition-colors hover:bg-secondary"
                    >
                      {/* Image Thumbnail */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-background">
                        <img
                          src={project.img}
                          alt={project.title}
                          className="relative z-10 h-full w-full object-cover grayscale transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Category Badge */}
                        <div className="absolute left-2.5 top-2.5 z-20">
                          <span className="editorial-label border border-border bg-background/80 px-2.5 py-1 text-foreground">
                            {Array.isArray(project.category)
                              ? project.category[0]
                              : project.category}
                          </span>
                        </div>

                        {/* Links Overlay - Top Right */}
                        <div className="absolute top-2.5 right-2.5 z-20 flex gap-1.5">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="border border-border bg-background/80 p-1.5 text-foreground/80 transition-colors hover:bg-primary hover:text-primary-foreground"
                              title="Live Demo"
                            >
                              <ExternalLink className="size-3.5" />
                            </a>
                          )}
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="border border-border bg-background/80 p-1.5 text-foreground/80 transition-colors hover:bg-primary hover:text-primary-foreground"
                              title="GitHub"
                            >
                              <Github className="size-3.5" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col gap-3 p-5">
                        <h3 className="line-clamp-1 font-serif text-2xl font-semibold text-foreground">
                          {project.title}
                        </h3>

                        {project.description && (
                          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                            {project.description}
                          </p>
                        )}

                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                          <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                            {project.tags.slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                className="editorial-label border border-border px-2 py-1 text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                            {project.tags.length > 3 && (
                              <span className="editorial-label border border-border px-2 py-1 text-muted-foreground">
                                +{project.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Hover Action Bar */}
                      <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-3">
                        <button
                          onClick={() => {
                            setEditingProject(project);
                            setIsProjectModalOpen(true);
                          }}
                          className="editorial-label flex items-center gap-1.5 border border-border px-3 py-2 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                          title="Edit Project"
                        >
                          <Pencil className="size-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this project?")) {
                              deleteProjectMutation.mutate(project.id);
                            }
                          }}
                          className="editorial-label flex items-center gap-1.5 border border-border px-3 py-2 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                          title="Delete Project"
                        >
                          <Trash2 className="size-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
                {projects?.length === 0 && (
                  <div className="col-span-full py-20 text-center text-muted-foreground">
                    No projects found. Add your first one!
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setEditingSkill(null);
                  setIsSkillModalOpen(true);
                }}
                className="editorial-button"
              >
                <Plus data-icon="inline-start" /> Add Skill
              </Button>
            </div>

            {isLoadingSkills ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-24 animate-pulse border border-border bg-card"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {skills?.map((skill) => (
                  <div
                    key={skill.id}
                    className="group flex items-center justify-between border border-border bg-card p-5 transition-colors hover:bg-secondary"
                  >
                    <div className="flex items-center gap-3">
                      {skill.img && (
                        <div className="flex size-10 items-center justify-center border border-border bg-background p-2">
                          <img
                            src={skill.img}
                            alt={skill.name}
                            className="h-full w-full object-contain brightness-0 invert grayscale"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-foreground">
                          {skill.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {skill.proficiency}%
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 transition-all group-hover:opacity-100">
                      <button
                        onClick={() => {
                          setEditingSkill(skill);
                          setIsSkillModalOpen(true);
                        }}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                        title="Edit Skill"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this skill?")) {
                            deleteSkillMutation.mutate(skill.id);
                          }
                        }}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                        title="Delete Skill"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {skills?.length === 0 && (
                  <div className="col-span-full py-20 text-center text-muted-foreground">
                    No skills found.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === "categories" && <CategoriesManager />}

        {/* HERO TAB */}
        {activeTab === "hero" && <HeroEditor />}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && <SettingsContent />}
      </div>

      {/* Modals */}
      <AddProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setEditingProject(null);
        }}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["projects"] })
        }
        initialData={editingProject}
      />

      <AddSkillModal
        isOpen={isSkillModalOpen}
        onClose={() => {
          setIsSkillModalOpen(false);
          setEditingSkill(null);
        }}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["skills"] })
        }
        initialData={editingSkill}
      />
    </div>
  );
}
