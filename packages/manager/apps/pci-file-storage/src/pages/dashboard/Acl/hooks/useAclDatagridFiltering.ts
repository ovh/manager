/* eslint-disable max-lines-per-function */
import { useCallback, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { FilterComparator, applyFilters } from '@ovh-ux/manager-core-api';
import { useColumnFilters } from '@ovh-ux/muk';
import type { FilterProps, SearchProps } from '@ovh-ux/muk';

import { TAclData } from '@/pages/dashboard/Acl/acl.view-model';
import { getAclStatusDisplay } from '@/pages/view-model/aclStatus.view-model';

type UseAclDatagridFilteringReturn = {
  filteredAcls: TAclData[];
  filterProps: FilterProps;
  searchProps: SearchProps;
};

type ColumnFilterProps = {
  comparator: FilterComparator;
  key: string;
  label: string;
  value: string | string[];
};

export const useAclDatagridFiltering = (acls: TAclData[]): UseAclDatagridFilteringReturn => {
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const { t } = useTranslation(['acl', 'status', NAMESPACES.ACTIONS]);

  const onSearch = useCallback((search: string) => {
    setSearchInput(search);
  }, []);

  const filteredAcls = useMemo(
    () =>
      searchInput
        ? acls.filter((acl) => acl.accessTo.toLowerCase().includes(searchInput.toLowerCase()))
        : applyFilters<TAclData>(acls, filters),
    [acls, filters, searchInput],
  );

  const handleAddFilter = useCallback(
    (filter: ColumnFilterProps) => {
      if (!filter.value || typeof filter.value !== 'string') return undefined;
      const displayValue = (() => {
        switch (filter.key) {
          case 'permission':
            return t(`acl:columns.accessPermission.${filter.value}`);
          case 'status':
            return t(getAclStatusDisplay(filter.value).labelKey);
          default:
            return undefined;
        }
      })();

      const filterWithLabel = {
        ...filter,
        value: filter.value,
        label: filter.label,
        displayValue: displayValue,
      };

      addFilter(filterWithLabel);
    },
    [addFilter, t],
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
      onSearch,
      placeholder: t(`${NAMESPACES.ACTIONS}:search`),
      searchInput,
      setSearchInput,
    }),
    [onSearch, t, searchInput],
  );

  return {
    filteredAcls,
    filterProps,
    searchProps,
  };
};
