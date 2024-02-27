import React from 'react';
import { OsdsChip } from '@ovhcloud/ods-components/chip/react';
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
      <OsdsChip
        key={universe}
        className="inline-flex m-3"
        color="primary"
        removable
        size="sm"
        onOdsChipRemoval={() => onDeleteUniverse(universe)}
      >
        {toFilterDisplay(universe)}
      </OsdsChip>
    ))}
    {categories.map((category) => (
      <OsdsChip
        key={category}
        className="inline-flex m-3"
        color="primary"
        removable
        size="sm"
        onOdsChipRemoval={() => onDeleteCategory(category)}
      >
        {toFilterDisplay(category)}
      </OsdsChip>
    ))}
  </div>
);

export default FilterChip;
