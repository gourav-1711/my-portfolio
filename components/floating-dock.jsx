"use client";

import { useState } from "react";
import {
  Github,
  Linkedin,
  Mail,
  User,
  FolderOpen,
  Briefcase,
} from "lucide-react";

const dockItems = [
  { icon: User, label: "About", href: "#about" },
  { icon: Briefcase, label: "Services", href: "#services" },
  { icon: FolderOpen, label: "Projects", href: "#projects" },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/gaurav-dadhich-92a571353/",
  },
  { icon: Mail, label: "Email", href: "#contact" },
];

export function FloatingDock() {
  const [hoveredIndex, setHoveredIndex] = useState();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="block md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-end space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3">
        {dockItems.map((item, index) => {
          const Icon = item.icon;
          const isHovered = hoveredIndex === index;
          const isAdjacent =
            hoveredIndex !== null && Math.abs(hoveredIndex - index) === 1;

          return (
            <a
              key={index}
              onClick={() => scrollToSection(item.href)}
              href={item.href}
              className={`relative flex items-center justify-center rounded-xl transition-all duration-300 ease-out ${
                isHovered
                  ? "w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500"
                  : isAdjacent
                  ? "w-12 h-12 bg-white/20"
                  : "w-10 h-10 bg-white/10 hover:bg-white/20"
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Icon
                className={`text-white transition-all duration-300 ${
                  isHovered ? "w-7 h-7" : isAdjacent ? "w-6 h-6" : "w-5 h-5"
                }`}
              />
              {isHovered && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-md whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
