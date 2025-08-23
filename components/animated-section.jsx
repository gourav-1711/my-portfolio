"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function AnimatedSection({ children, animation = "fade-up", delay = 0, className = "" }) {
  const { ref, isVisible } = useScrollAnimation()

  const getAnimationClasses = () => {
    const baseClasses = "transition-all duration-700 ease-out"

    switch (animation) {
      case "fade-up":
        return `${baseClasses} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`
      case "fade-in":
        return `${baseClasses} ${isVisible ? "opacity-100" : "opacity-0"}`
      case "slide-left":
        return `${baseClasses} ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`
      case "slide-right":
        return `${baseClasses} ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`
      case "scale-up":
        return `${baseClasses} ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`
      default:
        return baseClasses
    }
  }

  return (
    <div ref={ref} className={`${getAnimationClasses()} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}
