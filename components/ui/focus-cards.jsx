"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export const Card = React.memo(({ card, index, hovered, setHovered }) => (
  <div
    onMouseEnter={() => setHovered(index)}
    onMouseLeave={() => setHovered(null)}
    className={cn(
      "rounded-2xl relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out border border-white/10",
      hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
    )}
  >
    <img
      src={card.src}
      alt={card.title}
      className="object-cover absolute inset-0 w-full h-full"
    />
    <div
      className={cn(
        "absolute inset-0 bg-black/60 flex flex-col justify-end py-6 px-4 transition-opacity duration-300",
        hovered === index ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="bg-gradient-to-t from-black via-black/80 to-transparent p-4 absolute inset-0 flex flex-col justify-end">
        <div className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200 mb-2">
          {card.title}
        </div>
        <p className="text-gray-300 text-xs md:text-sm line-clamp-3 mb-4">
          {card.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {card.tags?.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-1 bg-white/10 rounded-full text-white border border-white/20"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-3">
          {card.liveUrl && (
            <button
              onClick={() => window.open(card.liveUrl, "_blank")}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-2 rounded-lg border border-white/20 transition-colors"
            >
              Live Demo
            </button>
          )}
          {card.githubUrl && (
            <button
              onClick={() => window.open(card.githubUrl, "_blank")}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-2 rounded-lg border border-white/20 transition-colors"
            >
              GitHub
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
));

Card.displayName = "Card";

export function FocusCards({ cards }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto md:px-8 w-full">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}
