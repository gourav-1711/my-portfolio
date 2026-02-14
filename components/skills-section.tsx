"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedBackground } from "@/components/animated-background";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skill } from "@/lib/types";
import { useSkillStore } from "@/lib/store";

interface SkillsSectionProps {
  initialData?: Skill[];
}

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

  // Default to first skill if available, or null
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  const filteredSkills = skills.filter((skill) => {
    const skillCategory = skill.category || "Core Web";
    return selectedCategory === "All" || skillCategory === selectedCategory;
  });

  // Select first skill of filtered list when category changes or data loads
  React.useEffect(() => {
    if (filteredSkills.length > 0) {
      setSelectedSkillId(filteredSkills[0].id);
    } else {
      setSelectedSkillId(null);
    }
  }, [selectedCategory, skills]);

  const selectedSkill = skills.find((s) => s.id === selectedSkillId) || null;

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 px-4 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border ${
              selectedCategory === cat
                ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105"
                : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden min-h-[500px]">
        <div className="absolute inset-0 pointer-events-none">
          <AnimatedBackground className="absolute inset-0 z-0 opacity-50" />
        </div>

        {/* Left Column: Skills List */}
        <div className="md:col-span-1 space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
          {filteredSkills.length > 0 ? (
            filteredSkills.map((skill) => (
              <button
                key={skill.id}
                onClick={() => setSelectedSkillId(skill.id)}
                className={`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 border ${
                  selectedSkillId === skill.id
                    ? "bg-white/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                    : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/10"
                }`}
              >
                <div className="w-10 h-10 relative flex-shrink-0 bg-white/5 rounded-lg p-2 overflow-hidden flex items-center justify-center">
                  <img
                    src={skill.img}
                    alt={skill.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span
                  className={`text-sm md:text-base font-medium transition-colors ${
                    selectedSkillId === skill.id
                      ? "text-white"
                      : "text-gray-400 group-hover:text-gray-200"
                  }`}
                >
                  {skill.name}
                </span>
              </button>
            ))
          ) : (
            <div className="text-gray-500 text-center py-8 text-sm">
              No skills in this category.
            </div>
          )}
        </div>

        {/* Right Column: Skill Details */}
        <div className="md:col-span-2 flex flex-col justify-center pl-0 md:pl-8 border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 relative z-10">
          <AnimatePresence mode="wait">
            {selectedSkill ? (
              <motion.div
                key={selectedSkill.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 rounded-2xl p-4 flex items-center justify-center border border-white/20 shadow-xl backdrop-blur-xl">
                    <img
                      src={selectedSkill.img}
                      alt={selectedSkill.name}
                      className="w-full h-full object-contain drop-shadow-md"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {selectedSkill.name}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-xs font-semibold tracking-wider uppercase">
                      {selectedSkill.category || "Tech Stack"}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">
                      Description
                    </h4>
                    <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                      {selectedSkill.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm uppercase tracking-wider text-gray-500 font-semibold">
                        Proficiency
                      </h4>
                      <span className="text-purple-400 font-bold">
                        {selectedSkill.proficiency}%
                      </span>
                    </div>
                    <div className="h-3 w-full bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedSkill.proficiency}%` }}
                        transition={{
                          duration: 1,
                          ease: "easeOut",
                          delay: 0.2,
                        }}
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500 h-full min-h-[300px]">
                <p>Select a skill to view details</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
