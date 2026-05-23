"use client";

import { Code2, Cpu, Database, Layers, Smartphone, Terminal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Skill } from "@/lib/types";
import { useSkillStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface SkillsSectionProps {
  initialData?: Skill[];
}

const iconMap = [Terminal, Code2, Cpu, Smartphone, Database, Layers];

export const SkillsSection = ({ initialData = [] }: SkillsSectionProps) => {
  const { selectedCategory, setSelectedCategory, categories } = useSkillStore();

  const { data: skills } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const res = await fetch("/api/skills");
      const data = await res.json();
      return data.data as Skill[];
    },
    initialData,
    staleTime: 1000 * 60 * 15,
  });

  const populatedCategories = categories.filter((category) => {
    if (category === "All") return true;
    return skills.some((skill) => (skill.category || "Core Web") === category);
  });

  const filteredSkills = skills.filter((skill) => {
    const skillCategory = skill.category || "Core Web";
    return selectedCategory === "All" || skillCategory === selectedCategory;
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-4 border-b border-border pb-6">
        {populatedCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "editorial-label border-b border-transparent pb-1 text-muted-foreground transition-colors hover:text-foreground",
              selectedCategory === cat && "border-foreground text-foreground",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredSkills.length > 0 ? (
        <div className="grid border-l border-t border-border sm:grid-cols-2">
          {filteredSkills.map((skill, index) => {
            const Icon = iconMap[index % iconMap.length];

            return (
              <article
                key={skill.id}
                className="group min-h-36 border-b border-r border-border bg-card/40 p-8 transition-colors hover:bg-secondary"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex flex-col gap-4">
                    <p className="text-xl font-medium uppercase text-foreground">
                      {skill.name}
                    </p>
                    {skill.description && (
                      <p className="line-clamp-3 max-w-sm text-sm leading-6 text-muted-foreground">
                        {skill.description}
                      </p>
                    )}
                    <p className="editorial-label text-muted-foreground">
                      {skill.category || "Tech Stack"}
                    </p>
                  </div>

                  {/* {skill.img ? (
                    <img
                      src={skill.img}
                      alt={skill.name}
                      className="size-7 shrink-0 object-contain brightness-0 invert "
                    />
                  ) : (
                    <Icon className="size-6 shrink-0 text-foreground" />
                  )} */}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="border border-border py-16 text-center text-muted-foreground">
          No skills in this category.
        </div>
      )}
    </div>
  );
};
