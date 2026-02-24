import { useCallback, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { FilterComparator } from '@ovh-ux/manager-core-api';
import type { FilterProps, SearchProps } from '@ovh-ux/muk';
import { useColumnFilters } from '@ovh-ux/muk';

import type { FilterWithField } from '@/data/hooks/shares/useShares';

type UseShareDatagridFilteringReturn = {
  filterProps: FilterProps;
  queryFilters: FilterWithField[];
  searchProps: SearchProps;
};

type ColumnFilterProps = {
  comparator: FilterComparator;
  key: string;
  label: string;
  value: string | string[];
};

const SHARE_ID_KEY = 'id';
type ApiField = 'name' | 'region' | 'shareID';

const columnKeyToField = (key: string): ApiField | null => {
  if (key === SHARE_ID_KEY) return 'shareID';
  if (key === 'name' || key === 'region') return key;
  return null;
};

type FilterWithKey = { key: string; value: string | string[] | undefined; [k: string]: unknown };

const buildQueryFilters = (searchInput: string, filters: FilterWithKey[]): FilterWithField[] => {
  const trimmed = searchInput.trim();
  if (trimmed) {
    return [
      {
        field: 'name',
        key: 'name',
        value: trimmed,
        comparator: FilterComparator.Includes,
      },
    ];
  }
  const firstApiFilter = filters.find((f) => columnKeyToField(f.key) !== null);
  if (!firstApiFilter || firstApiFilter.value === undefined) return [];

  const field = columnKeyToField(firstApiFilter.key);
  if (!field) return [];

  const value =
    typeof firstApiFilter.value === 'string' ? firstApiFilter.value : firstApiFilter.value?.[0];

  if (value === undefined) return [];
  return [{ ...firstApiFilter, field, value } as FilterWithField];
};

export const useShareDatagridFiltering = (): UseShareDatagridFilteringReturn => {
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const { t } = useTranslation(['list', NAMESPACES.ACTIONS]);

  const queryFilters = useMemo(
    () => buildQueryFilters(searchInput, filters),
    [searchInput, filters],
  );

  const handleAddFilter = useCallback(
    (filter: ColumnFilterProps) => {
      addFilter({
        ...filter,
        label: filter.label,
        displayValue: undefined,
      });
    },
    [addFilter],
  );

  const filterProps: FilterProps = useMemo(
    () => ({
      add: handleAddFilter,
      filters,
      remove: removeFilter,
    }),
    [handleAddFilter, filters, removeFilter],
  );

  const searchProps: SearchProps = useMemo(
    () => ({
      onSearch: (search: string) => setSearchInput(search),
      placeholder: t(`${NAMESPACES.ACTIONS}:search`),
      searchInput,
      setSearchInput,
    }),
    [t, searchInput],
  );

  return { filterProps, queryFilters, searchProps };
};
