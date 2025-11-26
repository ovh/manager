import { JSX, memo } from 'react';

import { FilterList } from '@/components/filters/filter-list/FilterList.component';

import { ColumnsFilteringComponent } from './columns-filtering/ColumnsFiltering.component';
import { ColumnsSearch } from './columns-search/ColumnsSearch.component';
import { ColumnVisibility } from './columns-visibility/ColumnsVisibility.component';
import { ColumnsVisibilityProps } from './columns-visibility/ColumnsVisiblity.props';
import { useDatagridTopbar } from './useDatagridTopbar';

const TopbarComponent = <T,>({
  columns,
  enableColumnvisibility,
  enableFilter,
  enableSearch,
  filters,
  getIsAllColumnsVisible,
  getIsSomeColumnsVisible,
  resourceType,
  search,
  setColumnVisibility,
  toggleAllColumnsVisible,
  topbar,
  visibleColumns,
}: ColumnsVisibilityProps<T>) => {
  const { filtersColumns, hasVisibilityFeature } = useDatagridTopbar({
    columns,
    visibleColumns,
  });

  return (
    <>
      <div
        data-testid="topbar-container"
        id="container"
        className="flex flex-wrap justify-between pb-6 items-center"
      >
        <div id="left-side" className="flex-1 w-full sm:w-auto sm:order-1 mr-4">
          {topbar && <>{topbar}</>}
        </div>
        <div id="right-side" className="w-full mt-[10px] sm:mt-[0px] sm:w-auto sm:order-3">
          <div className="flex justify-end items-center">
            {enableSearch && search && <ColumnsSearch search={search} />}
            {enableFilter && filtersColumns?.length > 0 && (
              <div className="ml-[10px]" data-testid="datagrid-topbar-filters">
                <ColumnsFilteringComponent
                  columns={filtersColumns}
                  filters={filters}
                  resourceType={resourceType}
                />
              </div>
            )}

            {enableColumnvisibility && setColumnVisibility && hasVisibilityFeature && (
              <div className={filtersColumns?.length > 0 ? 'ml-[10px]' : ''}>
                {visibleColumns && visibleColumns.length > 0 && (
                  <ColumnVisibility<T>
                    visibleColumns={visibleColumns}
                    toggleAllColumnsVisible={toggleAllColumnsVisible}
                    getIsAllColumnsVisible={getIsAllColumnsVisible}
                    getIsSomeColumnsVisible={getIsSomeColumnsVisible}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {enableFilter && filters && filters.filters.length > 0 && (
        <div data-testid="datagrid-filter-list" id="datagrid-filter-list" className="mb-[24px]">
          <FilterList filters={filters.filters} onRemoveFilter={filters.remove} />
        </div>
      )}
    </>
  );
};

export const Topbar = memo(TopbarComponent) as <T>(props: ColumnsVisibilityProps<T>) => JSX.Element;
