import { useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';

import { FilterComparator } from '@ovh-ux/manager-core-api';
import {
  Datagrid,
  FilterAdd,
  FilterList,
  useColumnFilters,
  useDataGrid,
} from '@ovh-ux/manager-react-components';
import { DatagridColumn } from '@ovh-ux/manager-react-components/dist/types/src/components/datagrid/datagrid.component';

import { TInstance } from '@/api/hooks/instance/selector/instances.selector';
import { TPaginatedResult } from '@/helpers';

type ColumnsFilter = Parameters<typeof FilterAdd>[0]['columns'];

export type ResourceSelectorProps<T = TInstance> = {
  resources: TPaginatedResult<T>;
  columns: DatagridColumn<T>[];
  paginationAndSorting: ReturnType<typeof useDataGrid>;
  filtering: ReturnType<typeof useColumnFilters> & { columnToFilter: ColumnsFilter };
  isPending: boolean;
};

export const ResourceSelector = ({
  resources,
  columns,
  paginationAndSorting: { pagination, setPagination, sorting, setSorting },
  filtering: { columnToFilter, filters, addFilter, removeFilter },
  isPending,
}: Readonly<ResourceSelectorProps>) => {
  const { t } = useTranslation(['filter']);
  const [searchField, setSearchField] = useState('');
  const filterPopoverRef = useRef<HTMLOsdsPopoverElement>(undefined);

  return (
    <div>
      {!isPending && (
        <div className="sm:flex items-center justify-end">
          <div className="justify-between flex">
            <OsdsSearchBar
              className="w-[70%]"
              value={searchField}
              onChange={(e) => setSearchField(e.currentTarget.value)}
              onOdsSearchSubmit={({ detail }) => {
                console.log({ detail }, { searchField });
                setPagination({
                  pageIndex: 0,
                  pageSize: pagination.pageSize,
                });
                addFilter({
                  key: 'searchField',
                  value: detail.inputValue,
                  comparator: FilterComparator.Includes,
                  label: '',
                });
                setSearchField('');
              }}
            />
            <OsdsPopover ref={filterPopoverRef}>
              <OsdsButton
                slot="popover-trigger"
                size={ODS_BUTTON_SIZE.sm}
                color={ODS_THEME_COLOR_INTENT.primary}
                variant={ODS_BUTTON_VARIANT.stroked}
              >
                <OsdsIcon
                  name={ODS_ICON_NAME.FILTER}
                  size={ODS_ICON_SIZE.xs}
                  className="mr-2"
                  color={ODS_THEME_COLOR_INTENT.primary}
                />
                {t('filter:common_criteria_adder_filter_label')}
              </OsdsButton>
              <OsdsPopoverContent>
                <FilterAdd
                  columns={columnToFilter}
                  onAddFilter={(addedFilter, column) => {
                    setPagination({
                      pageIndex: 0,
                      pageSize: pagination.pageSize,
                    });
                    addFilter({
                      ...addedFilter,
                      label: column.label,
                    });
                    void filterPopoverRef.current?.closeSurface();
                  }}
                />
              </OsdsPopoverContent>
            </OsdsPopover>
          </div>
        </div>
      )}
      <div className="my-5">
        <FilterList filters={filters} onRemoveFilter={removeFilter} />
      </div>
      {isPending && (
        <div className="text-center">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      )}
      {!isPending && (
        <Datagrid
          columns={columns}
          items={resources?.rows || []}
          totalItems={resources?.totalRows || 0}
          pagination={pagination}
          sorting={sorting}
          onSortChange={setSorting}
          onPaginationChange={setPagination}
        />
      )}
    </div>
  );
};
