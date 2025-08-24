"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);

  useEffect(() => {
    addAnimation();
    Aos.init({
      duration: 700,
    });
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            key={item.name}
            data-aos="fade-up"
            data-aos-delay={idx * 100}
            className="relative w-48 px-3 py-4 max-w-full shrink-0 rounded-2xl border border-white/20 bg-gradient-to-br from-slate-400/30 via-gray-800/50 to-gray-500/30 backdrop-blur-lg shadow-lg"
          >
            <div className="flex flex-col items-center text-center">
              {/* Skill Image */}
              <div className="w-20 h-20 mb-4 rounded-xl overflow-hidden shadow-md">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Skill Info */}
              <span className="text-lg font-semibold text-white">
                {item.name}
              </span>
              <span className="text-sm text-gray-300">{item.title}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
