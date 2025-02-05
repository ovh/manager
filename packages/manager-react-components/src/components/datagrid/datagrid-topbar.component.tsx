import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_ICON_NAME,
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_SIZE,
  ODS_INPUT_TYPE,
} from '@ovhcloud/ods-components';
import {
  OdsPopover,
  OdsButton,
  OdsInput,
} from '@ovhcloud/ods-components/react';
import { FilterCategories } from '@ovh-ux/manager-core-api';
import { FilterAdd, FilterList } from '../filters';
import { ColumnFilter } from '../filters/filter-add.component';
import './translations';

export const DatagridTopbar = ({ columns, filters, search }) => {
  const { t } = useTranslation('filters');
  const filterPopoverRef = useRef(null);

  const columnsFilters = useMemo<ColumnFilter[]>(
    () =>
      columns
        .filter(
          (item) =>
            ('comparator' in item || 'type' in item) &&
            'isFilterable' in item &&
            item.isFilterable,
        )
        .map((column) => ({
          id: column.id,
          label: column.label,
          ...(column?.type && { comparators: FilterCategories[column.type] }),
          ...(column?.comparator && { comparators: column.comparator }),
        })),
    [columns],
  );

  const columnSearchable = useMemo<ColumnFilter[]>(
    () =>
      columns?.find((item) =>
        Object.prototype.hasOwnProperty.call(item, 'isSearchable'),
      ),
    [columns],
  );

  return (
    <div>
      {(columnsFilters.length > 0 || columnSearchable) && (
        <div className="flex justify-end py-[24px]">
          {columnSearchable && (
            <div data-testid="datagrid-topbar-search">
              <OdsInput
                isClearable
                onOdsClear={() => {
                  search?.onSearch(null);
                  search?.setSearchInput('');
                }}
                type={ODS_INPUT_TYPE.text}
                id="datagrid-searchbar"
                name="datagrid-searchbar"
                defaultValue={search?.searchInput}
                className="mr-[5px]"
                data-testid="datagrid-searchbar"
                onOdsChange={(event) => {
                  search?.setSearchInput(event?.detail?.value?.toString());
                }}
                value={search?.searchInput}
              />
              <OdsButton
                onClick={() => {
                  search?.onSearch(search?.searchInput);
                }}
                icon="magnifying-glass"
                size="sm"
                label=""
              />
            </div>
          )}
          {columnsFilters.length > 0 && (
            <div className="ml-[10px]" data-testid="datagrid-topbar-filters">
              <OdsButton
                id="datagrid-filter-popover-trigger"
                slot="datagrid-filter-popover-trigger"
                size={ODS_BUTTON_SIZE.sm}
                variant={ODS_BUTTON_VARIANT.ghost}
                icon={ODS_ICON_NAME.filter}
                aria-label={t('common_criteria_adder_filter_label')}
                label=""
              />
              <OdsPopover
                ref={filterPopoverRef}
                triggerId="datagrid-filter-popover-trigger"
                with-arrow
              >
                <FilterAdd
                  columns={columnsFilters}
                  onAddFilter={(addedFilter, column) => {
                    filters.add({
                      ...addedFilter,
                      label: column.label,
                    });
                    filterPopoverRef.current?.hide();
                  }}
                />
              </OdsPopover>
            </div>
          )}
        </div>
      )}
      {filters?.filters.length > 0 && (
        <div
          data-testid="datagrid-filter-list"
          id="datagrid-filter-list"
          className="mb-[24px]"
        >
          <FilterList
            filters={filters.filters}
            onRemoveFilter={filters.remove}
          />
        </div>
      )}
    </div>
  );
};
