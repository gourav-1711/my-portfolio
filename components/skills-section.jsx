"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedBackground } from "@/components/animated-background";

// ... skills data omitted for brevity ...
const skills = [
  {
    id: 1,
    name: "HTML",
    img: "/img/skills/HTML.png",
    description:
      "The standard markup language for documents designed to be displayed in a web browser. It is the building block of the web.",
    progress: 95,
  },
  {
    id: 2,
    name: "CSS",
    img: "/img/skills/CSS-Logo-PNG-Symbol-for-Web-Development-Transparent.png",
    description:
      "Cascading Style Sheets is a style sheet language used for describing the presentation of a document written in HTML.",
    progress: 90,
  },
  {
    id: 3,
    name: "JavaScript",
    img: "/img/skills/Java-Script.png",
    description:
      "A high-level, interpreted programming language that conforms to the ECMAScript specification. It enables interactive web pages.",
    progress: 90,
  },
  {
    id: 4,
    name: "React",
    img: "/img/skills/React.png",
    description:
      "A JavaScript library for building user interfaces. It allows for the creation of reusable UI components.",
    progress: 85,
  },
  {
    id: 5,
    name: "Next.js",
    img: "/img/skills/nextjs.svg",
    description:
      "A React framework that enables server-side rendering and generating static websites for React based web applications.",
    progress: 85,
  },
  {
    id: 6,
    name: "Node.js",
    img: "/img/skills/Node-js.png",
    description:
      "An open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser.",
    progress: 80,
  },
  {
    id: 7,
    name: "Electron Js",
    img: "/img/skills/electron.png",
    description:
      "A framework for creating native applications with web technologies like JavaScript, HTML, and CSS.",
    progress: 75,
  },
  {
    id: 8,
    name: "MongoDB",
    img: "/img/skills/mongo.png",
    description:
      "A source-available cross-platform document-oriented database program. Classified as a NoSQL database program.",
    progress: 80,
  },
  {
    id: 9,
    name: "Express.js",
    img: "/img/skills/express.png",
    description:
      "A back-end web application framework for Node.js. It is designed for building web applications and APIs.",
    progress: 80,
  },
  {
    id: 10,
    name: "Tailwind CSS",
    img: "/img/skills/Tailwind.png",
    description:
      "A utility-first CSS framework for rapidly building custom designs without ever leaving your HTML.",
    progress: 95,
  },
  {
    id: 11,
    name: "TypeScript",
    img: "/img/skills/typescript.png",
    description:
      "A typed superset of JavaScript that compiles to plain JavaScript. It adds optional types to the language.",
    progress: 80,
  },
  {
    id: 12,
    name: "React Native",
    img: "/img/skills/react-native.png",
    description:
      "A framework for building native applications using React. It allows you to use the same code base for iOS and Android.",
    progress: 75,
  },
  {
    id: 13,
    name: "Figma",
    img: "/img/skills/figma.png",
    description:
      "A vector graphics editor and prototyping tool which is primarily web-based.",
    progress: 70,
  },
];

export const SkillsSection = () => {
  const [selectedSkill, setSelectedSkill] = useState(skills[0]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <AnimatedBackground className="absolute inset-0 z-0 opacity-50" />
      </div>

      {/* Left Column: Skills List */}
      <div className="md:col-span-1 space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
        {skills.map((skill) => (
          <button
            key={skill.id}
            onClick={() => setSelectedSkill(skill)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 border ${
              selectedSkill.id === skill.id
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
                selectedSkill.id === skill.id
                  ? "text-white"
                  : "text-gray-400 group-hover:text-gray-200"
              }`}
            >
              {skill.name}
            </span>
          </button>
        ))}
      </div>

      {/* Right Column: Skill Details */}
      <div className="md:col-span-2 flex flex-col justify-center pl-0 md:pl-8 border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 relative z-10">
        <AnimatePresence mode="wait">
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
                  Tech Stack
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
                    {selectedSkill.progress}%
                  </span>
                </div>
                <div className="h-3 w-full bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedSkill.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
