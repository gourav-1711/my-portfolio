"use client"

import { useEffect, useState } from "react"

export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentProgress = window.scrollY
      const scrollHeight = document.body.scrollHeight - window.innerHeight

      if (scrollHeight) {
        setScrollProgress((currentProgress / scrollHeight) * 100)
      }
    }

    window.addEventListener("scroll", updateScrollProgress)
    updateScrollProgress()

    return () => window.removeEventListener("scroll", updateScrollProgress)
  }, [])

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50">
      {/* Background track */}
      <div className="w-1 h-screen bg-gray-800/30 rounded-full backdrop-blur-sm">
        {/* Progress fill */}
        <div
          className="w-full bg-gradient-to-t from-cyan-400 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
          style={{ height: `${scrollProgress}%` }}
        >
          {/* Neon glow effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-400 via-purple-500 to-pink-500 rounded-full blur-sm opacity-75" />

          {/* Animated shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent rounded-full animate-pulse" />
        </div>
      </div>

      {/* Percentage indicator */}
      <div className="absolute -left-11 md:top-8 top-24 -translate-y-1/2 text-xs font-mono text-cyan-400 bg-gray-900/80 px-2 py-1 rounded backdrop-blur-sm border border-cyan-400/30">
        {Math.round(scrollProgress)}%
      </div>

      {/* Outer glow */}
      <div className="absolute inset-0 w-1 h-64 bg-gradient-to-t from-cyan-400/20 via-purple-500/20 to-pink-500/20 rounded-full blur-md -z-10" />
    </div>
  )
}
