import { useState } from 'react';
import { Filter } from '../../hooks/useCoreApiClient';

import { FilterWithLabel } from './interface';
import './translations';

const filterEquals = (a: Filter, b: Filter) =>
  a.key === b.key && a.value === b.value && a.comparator === b.comparator;

export function useColumnFilters() {
  const [filters, setFilters] = useState<FilterWithLabel[]>([]);

  return {
    filters,
    addFilter: (filter: FilterWithLabel) => {
      if (filter.value) {
        setFilters((previousFilters) => {
          /**
           * ? To remove the duplication from the filters
           */
          if (previousFilters.some((f) => filterEquals(f, filter))) {
            return previousFilters;
          }
          return [...previousFilters, filter];
        });
      }
    },
    removeFilter: (filter: Filter) => {
      setFilters((previousFilters) =>
        previousFilters.filter((f) => !filterEquals(f, filter)),
      );
    },
  };
}
