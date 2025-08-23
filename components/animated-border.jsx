"use client"

export function AnimatedBorder({ children, className = "", duration = "3s" }) {
  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: `conic-gradient(from 0deg, transparent, rgba(107, 114, 128, 0.8), rgba(75, 85, 99, 0.8), transparent)`,
          animation: `spin ${duration} linear infinite`,
        }}
      />
      <div className="relative m-[1px] rounded-xl bg-slate-900/90 backdrop-blur-md">{children}</div>
    </div>
  )
}
