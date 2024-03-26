import { Filter } from '@ovh-ux/manager-core-api';
import { useState } from 'react';

function filterEquals(a: Filter, b: Filter) {
  return (
    a.key === b.key && a.value === b.value && a.comparator === b.comparator
  );
}

export type FilterWithLabel = Filter & { label: string };

export default function useColumnFilters() {
  const [filters, setFilters] = useState<FilterWithLabel[]>([]);

  return {
    filters,
    addFilter: (filter: FilterWithLabel) => {
      setFilters((others) => {
        // cannot have duplicate filters
        if (others.some((f) => filterEquals(f, filter))) {
          return others;
        }
        return [...others, filter];
      });
    },
    removeFilter: (filter: Filter) => {
      setFilters((others) => others.filter((f) => !filterEquals(f, filter)));
    },
  };
}
