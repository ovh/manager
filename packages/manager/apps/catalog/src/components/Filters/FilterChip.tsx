import React from 'react';
import { toFilterDisplay } from '@/utils/utils';

interface FilterChipProps {
  universes: string[];
  categories: string[];
  onDeleteCategory: (category: string) => void;
  onDeleteUniverse: (category: string) => void;
}

const FilterChip = ({
  universes,
  categories,
  onDeleteCategory,
  onDeleteUniverse,
}: FilterChipProps) => (
  <div className="flex flex-row flex-wrap md:justify-end md:pt-4 mt-4">
    {universes.map((universe) => (
      <span
        key={universe}
        className="inline-flex m-3"
        onClick={() => onDeleteUniverse(universe)}
      >
        {toFilterDisplay(universe)}
      </span>
    ))}
    {categories.map((category) => (
      <span
        key={category}
        className="inline-flex m-3"
        onClick={() => onDeleteCategory(category)}
      >
        {toFilterDisplay(category)}
      </span>
    ))}
  </div>
);

export default FilterChip;
