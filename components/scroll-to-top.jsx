"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Show/hide button based on scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Haptic feedback for mobile
  const handleTap = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    if (isScrolling) return;

    setIsScrolling(true);
    handleTap();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Reset scrolling state after animation completes
    setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  return (
    <button
      onClick={scrollToTop}
      onTouchStart={handleTap}
      aria-label="Scroll to top"
      className={`fixed right-4 bottom-20 md:right-6 md:bottom-8 z-30 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/30 transition-all duration-300 transform ${
        isVisible
          ? "opacity-100 translate-y-0 hover:scale-110 hover:shadow-xl hover:shadow-purple-500/50"
          : "opacity-0 translate-y-4 pointer-events-none"
      } ${isScrolling ? "animate-bounce" : ""}`}
    >
      <ArrowUp className="w-5 h-5 md:w-6 md:h-6" />
    </button>
  );
}
