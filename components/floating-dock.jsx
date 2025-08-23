"use client";

import { useState, useEffect } from "react";
import {
  Github,
  Linkedin,
  Mail,
  User,
  FolderOpen,
  Briefcase,
  ChevronUp,
  X,
} from "lucide-react";

const dockItems = [
  { icon: User, label: "About", href: "#about" },
  { icon: Briefcase, label: "Services", href: "#services" },
  { icon: FolderOpen, label: "Projects", href: "#projects" },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/gaurav-dadhich-92a571353/",
    external: true,
  },
  { icon: Mail, label: "Contact", href: "#contact" },
];

export function FloatingDock() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll to update active section and dock visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide dock when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);

      // Update active section based on scroll position
      const sections = ["about", "services", "projects", "contact"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (href, isExternal = false) => {
    if (isExternal) {
      window.open(href, "_blank");
      return;
    }

    const element = document.getElementById(href.substring(1));
    if (element) {
      const headerHeight = 80;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Close the dock after clicking on mobile
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    }
  };

  // Haptic feedback for mobile
  const handleTap = (e) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }
  };

  // Toggle dock expansion on mobile
  const toggleDock = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`block md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "translate-y-24"
      }`}
    >
      {/* Main Dock */}
      <div
        className={`flex items-center justify-center space-x-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 transition-all duration-300 ${
          isExpanded ? "max-w-xs" : "max-w-fit"
        }`}
      >
        {/* Show all items when expanded, otherwise show active item */}
        {isExpanded ? (
          <>
            {dockItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeSection === item.href.substring(1);

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.href, item.external)}
                  onTouchStart={handleTap}
                  className={`relative flex flex-col items-center justify-center rounded-xl transition-all duration-200 ease-out ${
                    isActive
                      ? "w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500"
                      : "w-12 h-12 bg-white/10 hover:bg-white/20"
                  }`}
                  aria-label={item.label}
                >
                  <Icon
                    className={`w-5 h-5 text-white ${
                      isActive ? "opacity-100" : "opacity-80"
                    }`}
                  />
                  <span className="text-[10px] text-white mt-1">
                    {item.label}
                  </span>
                </button>
              );
            })}
            <button
              onClick={toggleDock}
              className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white"
              aria-label="Collapse menu"
            >
              <X className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={toggleDock}
              className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              aria-label="Expand menu"
            >
              <ChevronUp className="w-5 h-5 text-white" />
            </button>
          </>
        )}
      </div>

      {/* Active item indicator for collapsed state */}
      {!isExpanded && (
        <div className="mt-2 text-center">
          <span className="inline-block px-2 py-1 bg-black/50 text-white text-xs rounded-full">
            {dockItems.find((item) => item.href === `#${activeSection}`)
              ?.label || "Menu"}
          </span>
        </div>
      )}
    </div>
  );
}
