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
        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
        activeTab === id
          ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
          : "text-gray-400 hover:text-white hover:bg-white/5",
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Manage your portfolio content.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
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
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Project
              </Button>
            </div>

            {isLoadingProjects ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-40 bg-white/5 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects?.map((project) => (
                  <div
                    key={project.id}
                    className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 hover:border-purple-500/30 transition-colors group relative"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-white text-lg line-clamp-1">
                        {project.title}
                      </h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10">
                        {project.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingProject(project);
                          setIsProjectModalOpen(true);
                        }}
                        className="p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors"
                        title="Edit Project"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this project?")) {
                            deleteProjectMutation.mutate(project.id);
                          }
                        }}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {projects?.length === 0 && (
                  <div className="col-span-full text-center py-20 text-gray-500">
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
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Skill
              </Button>
            </div>

            {isLoadingSkills ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-white/5 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {skills?.map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      {skill.img && (
                        <div className="w-10 h-10 bg-white/5 rounded-lg p-2 flex items-center justify-center">
                          <img
                            src={skill.img}
                            alt={skill.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-white">{skill.name}</h4>
                        <p className="text-sm text-gray-500">
                          {skill.proficiency}%
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => {
                          setEditingSkill(skill);
                          setIsSkillModalOpen(true);
                        }}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Edit Skill"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this skill?")) {
                            deleteSkillMutation.mutate(skill.id);
                          }
                        }}
                        className="text-gray-600 hover:text-red-500 transition-colors"
                        title="Delete Skill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {skills?.length === 0 && (
                  <div className="col-span-full text-center py-20 text-gray-500">
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
