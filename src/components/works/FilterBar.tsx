'use client';

import { motion } from 'framer-motion';
import { mediumLabels, categoryLabels } from '@/data/projects';

interface FilterBarProps {
  activeCategory: string | null;
  activeMedium: string | null;
  activeTag: string | null;
  allTags: string[];
  onCategoryChange: (category: string | null) => void;
  onMediumChange: (medium: string | null) => void;
  onTagChange: (tag: string | null) => void;
}

export function FilterBar({
  activeCategory,
  activeMedium,
  activeTag,
  allTags,
  onCategoryChange,
  onMediumChange,
  onTagChange,
}: FilterBarProps) {
  const mediums = Object.entries(mediumLabels);
  const categories = Object.entries(categoryLabels);

  return (
    <div className="space-y-4">
      {/* Category filter — 의도 축 (work / commissions / studies) */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 border-2 transition-colors ${
            activeCategory === null
              ? 'border-stone-500 text-stone-300'
              : 'border-stone-700 text-stone-500 hover:text-stone-400 hover:border-stone-600'
          }`}
        >
          All
        </button>
        {categories.map(([key, label]) => (
          <button
            key={key}
            onClick={() => onCategoryChange(key)}
            className={`text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 border-2 transition-colors ${
              activeCategory === key
                ? 'border-stone-500 text-stone-300'
                : 'border-stone-700 text-stone-500 hover:text-stone-400 hover:border-stone-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Medium filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onMediumChange(null)}
          className={`text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 border-2 transition-colors ${
            activeMedium === null
              ? 'border-stone-500 text-stone-300'
              : 'border-stone-700 text-stone-500 hover:text-stone-400 hover:border-stone-600'
          }`}
        >
          All
        </button>
        {mediums.map(([key, label]) => (
          <button
            key={key}
            onClick={() => onMediumChange(key)}
            className={`text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 border-2 transition-colors ${
              activeMedium === key
                ? 'border-stone-500 text-stone-300'
                : 'border-stone-700 text-stone-500 hover:text-stone-400 hover:border-stone-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tag filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onTagChange(null)}
          className={`text-[9px] font-medium tracking-wider uppercase px-2 py-1 border-2 transition-colors ${
            activeTag === null
              ? 'border-stone-500 text-stone-400'
              : 'border-stone-700 text-stone-500 hover:text-stone-400'
          }`}
        >
          all tags
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagChange(tag)}
            className={`text-[9px] font-medium tracking-wider uppercase px-2 py-1 border-2 transition-colors ${
              activeTag === tag
                ? 'border-stone-500 text-stone-400'
                : 'border-stone-700 text-stone-500 hover:text-stone-400'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
