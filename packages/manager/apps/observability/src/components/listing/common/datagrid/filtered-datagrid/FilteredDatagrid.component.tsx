import { Suspense, useCallback, useMemo, useState } from 'react';

import { TABLE_SIZE } from '@ovhcloud/ods-react';

import { FilterComparator, applyFilters } from '@ovh-ux/manager-core-api';
import { Datagrid, useColumnFilters } from '@ovh-ux/muk';

import { FilteredDatagridProps } from '@/components/listing/common/datagrid/filtered-datagrid/FilteredDatagrid.props';

const CONTAINER_HEIGHT = 725; // TOFIX: waiting muk fixes

export default function FilteredDatagrid<T extends Record<string, unknown>>({
  data,
  columns,
  topbar,
  isLoading,
  resourceType,
  searchFilterLabel,
}: FilteredDatagridProps<T>) {
  const [searchInput, setSearchInput] = useState<string>('');

  const { filters, addFilter: add, removeFilter: remove } = useColumnFilters();

  const filteredData = useMemo(() => {
    return applyFilters(data, filters);
  }, [data, filters]);

  const filtersProps = useMemo(() => ({ filters, add, remove }), [filters, add, remove]);

  const onSearch = useCallback(
    (newSearch: string) => {
      if (newSearch && newSearch.length) {
        add({
          key: 'search',
          label: searchFilterLabel,
          value: newSearch,
          comparator: FilterComparator.Includes,
        });
        setSearchInput('');
      }
    },
    [add, searchFilterLabel],
  );

  const searchProps = useMemo(
    () => ({
      searchInput,
      setSearchInput,
      onSearch,
    }),
    [searchInput, onSearch],
  );

  return (
    <Suspense>
      <Datagrid<T>
        key={filteredData.length}
        topbar={topbar}
        columns={columns}
        data={filteredData}
        totalCount={filteredData.length}
        filters={filtersProps}
        search={searchProps}
        containerHeight={CONTAINER_HEIGHT}
        size={TABLE_SIZE.lg}
        contentAlignLeft
        isLoading={isLoading}
        resourceType={resourceType}
      />
    </Suspense>
  );
}
