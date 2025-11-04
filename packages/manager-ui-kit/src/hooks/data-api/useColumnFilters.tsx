import { useState } from 'react';

import { FilterComparator, FilterTypeCategories } from '@ovh-ux/manager-core-api';
import type { Filter } from '@ovh-ux/manager-core-api';

import { FilterWithLabel } from '@/components/filters/Filter.props';
import { filterEquals } from '@/hooks/data-api/utils/DataApi.utils';

import '../../components/filters/translations';

export function useColumnFilters() {
  const [filters, setFilters] = useState<FilterWithLabel[]>([]);

  return {
    filters,
    addFilter: (filter: FilterWithLabel) => {
      if (
        filter.value ||
        (filter.type === FilterTypeCategories.Tags &&
          [FilterComparator.TagExists, FilterComparator.TagNotExists].includes(filter.comparator))
      ) {
        setFilters((previousFilters) => {
          if (previousFilters.some((f) => filterEquals(f, filter))) {
            return previousFilters;
          }
          return [...previousFilters, filter];
        });
      }
    },
    removeFilter: (filter: Filter) => {
      setFilters((previousFilters) => previousFilters.filter((f) => !filterEquals(f, filter)));
    },
  };
}
