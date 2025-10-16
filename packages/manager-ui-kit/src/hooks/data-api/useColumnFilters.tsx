import { useState } from 'react';
import {
  Filter,
  FilterComparator,
  FilterTypeCategories,
} from '@ovh-ux/manager-core-api';
import { FilterWithLabel } from '../../components/filters/Filter.props';
import '../../components/filters/translations';

const filterEquals = (a: Filter, b: Filter) =>
  a.key === b.key && a.value === b.value && a.comparator === b.comparator;

export function useColumnFilters() {
  const [filters, setFilters] = useState<FilterWithLabel[]>([]);

  return {
    filters,
    addFilter: (filter: FilterWithLabel) => {
      if (
        filter.value ||
        (filter.type === FilterTypeCategories.Tags &&
          [FilterComparator.TagExists, FilterComparator.TagNotExists].includes(
            filter.comparator,
          ))
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
      setFilters((previousFilters) =>
        previousFilters.filter((f) => !filterEquals(f, filter)),
      );
    },
  };
}
