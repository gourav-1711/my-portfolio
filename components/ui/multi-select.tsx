"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X, Check } from "lucide-react";
import { clsx } from "clsx";

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options…",
  isLoading = false,
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const removeOption = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((v) => v !== value));
  };

  if (isLoading) {
    return <div className="h-10 w-full bg-white/5 animate-pulse rounded-lg" />;
  }

  return (
    <div ref={containerRef} className={clsx("relative", className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3 text-left hover:border-white/20 transition-colors min-h-[44px]"
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 mr-2">
          {selected.length === 0 ? (
            <span className="text-gray-500 text-sm">{placeholder}</span>
          ) : (
            selected.map((val) => {
              const label = options.find((o) => o.value === val)?.label || val;
              return (
                <span
                  key={val}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded-md text-xs text-purple-300"
                >
                  {label}
                  <button
                    type="button"
                    onClick={(e) => removeOption(val, e)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })
          )}
        </div>
        <ChevronDown
          className={clsx(
            "w-4 h-4 text-gray-400 transition-transform shrink-0",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 mt-2 w-full bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto"
          >
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                No options available
              </div>
            ) : (
              options.map((opt) => {
                const isSelected = selected.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleOption(opt.value)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                  >
                    <div
                      className={clsx(
                        "w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0",
                        isSelected
                          ? "bg-purple-500 border-purple-500"
                          : "border-white/20 bg-transparent",
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span
                      className={clsx(
                        "text-sm",
                        isSelected ? "text-white font-medium" : "text-gray-400",
                      )}
                    >
                      {opt.label}
                    </span>
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
