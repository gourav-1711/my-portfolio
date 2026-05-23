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
    return <div className="h-11 w-full animate-pulse border border-border bg-card" />;
  }

  return (
    <div ref={containerRef} className={clsx("relative", className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-11 w-full items-center justify-between border border-border bg-background px-4 py-3 text-left transition-colors hover:border-primary"
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 mr-2">
          {selected.length === 0 ? (
            <span className="text-sm text-muted-foreground">{placeholder}</span>
          ) : (
            selected.map((val) => {
              const label = options.find((o) => o.value === val)?.label || val;
              return (
                <span
                  key={val}
                  className="editorial-label inline-flex items-center gap-1 border border-border px-2 py-1 text-muted-foreground"
                >
                  {label}
                  <button
                    type="button"
                    onClick={(e) => removeOption(val, e)}
                    className="transition-colors hover:text-foreground"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              );
            })
          )}
        </div>
        <ChevronDown
          className={clsx(
            "size-4 shrink-0 text-muted-foreground transition-transform",
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
            className="absolute z-50 mt-2 max-h-48 w-full overflow-hidden overflow-y-auto border border-border bg-card shadow-none"
          >
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground">
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
                    className="flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary"
                  >
                    <div
                      className={clsx(
                        "flex size-4 shrink-0 items-center justify-center border transition-colors",
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-border bg-transparent",
                      )}
                    >
                      {isSelected && <Check className="size-3 text-primary-foreground" />}
                    </div>
                    <span
                      className={clsx(
                        "text-sm",
                        isSelected ? "font-medium text-foreground" : "text-muted-foreground",
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
