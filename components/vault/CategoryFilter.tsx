"use client";

import React from "react";
import { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selected: Category | "All";
  onSelect: (cat: Category | "All") => void;
  counts?: Record<string, number>;
}

const CATEGORIES: Array<Category | "All"> = [
  "All",
  "Social",
  "Work",
  "Shopping",
  "Finance",
  "Education",
  "Other",
];

export function CategoryFilter({ selected, onSelect, counts }: CategoryFilterProps) {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
      {CATEGORIES.map((cat) => {
        const isSelected = selected === cat;
        const count = counts ? counts[cat] : undefined;

        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 flex items-center space-x-1.5 select-none",
              isSelected
                ? "bg-electric-600 text-white shadow-glow-sm"
                : "bg-charcoal-900 hover:bg-charcoal-800 text-slate-400 hover:text-slate-200 border border-charcoal-700/60"
            )}
          >
            <span>{cat}</span>
            {count !== undefined && (
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.2 rounded-full",
                  isSelected ? "bg-white/20 text-white" : "bg-charcoal-800 text-slate-400"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
