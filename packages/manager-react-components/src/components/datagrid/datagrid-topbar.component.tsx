import { useMemo, useRef, useState } from 'react';
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
import {
  FilterComparator,
  FilterCategories,
  FilterTypeCategories,
} from '@ovh-ux/manager-core-api';
import { FilterAdd, FilterList } from '../filters';
import { ColumnFilter } from '../filters/filter-add.component';
// import { FilterWithLabel } from '../filters/interface';
// import { DataGridTextCell } from './text-cell.component';
// import { defaultNumberOfLoadingRows } from './datagrid.contants';
import './translations';

export const DatagridTopbar = ({ columns, filters, search }) => {
  const { t: tfilters } = useTranslation('filters');
  const { onSearch, searchInput, setSearchInput } = search;
  const filterPopoverRef = useRef(null);

  console.info('filters : ', filters);
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

  const columnsSearchable = useMemo<ColumnFilter[]>(
    () =>
      columns
        .filter((item) => item.isSearchable)
        .map((column) => ({
          id: column.id,
          label: column.label,
          ...(column?.type && { comparators: FilterCategories[column.type] }),
          ...(column?.comparator && { comparators: column.comparator }),
        })),
    [columns],
  );
  return (
    <div>
      DatagridTopbar test coucou
      {columnsFilters.length > 0 && (
        <div
          className="flex justify-end py-[24px]"
          style={{ backgroundColor: 'pink' }}
        >
          <div className="search-bar mr-[10px]">
            <OdsInput
              type={ODS_INPUT_TYPE.text}
              id="datagrid-searchbar"
              name="datagrid-searchbar"
              defaultValue={searchInput}
              className="mr-[5px]"
              data-testid="datagrid-searchbar"
              onOdsChange={(event) => {
                setSearchInput(event.detail.value.toString());
              }}
              value={searchInput}
            />
            <OdsButton
              onClick={() => {
                console.info('va lancer le onSearch !!');
                onSearch(searchInput);
                setSearchInput(searchInput);
                // const test = columnsFilters.map((element) => ({
                //   key: element.id,
                //   value: searchInput,
                //   comparator: FilterComparator.Includes,
                //   label: element.id,
                // }));

                // console.info('columnsSearchable : ', columnsSearchable);
                // console.info('test : ', test);
                // filters.add(test[0]);
                // filters.add(test[1]);
                // filters.add(test[2]);
                // filters.add(test[3]);
              }}
              icon="magnifying-glass"
              size="sm"
              label=""
            />
          </div>
          <div>
            <OdsButton
              id="datagrid-filter-popover-trigger"
              slot="datagrid-filter-popover-trigger"
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.ghost}
              icon={ODS_ICON_NAME.filter}
              aria-label={tfilters('common_criteria_adder_filter_label')}
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
        </div>
      )}
      {filters?.filters.length > 0 && (
        <div id="datagrid-filter-list" className="mb-[24px]">
          <FilterList
            filters={filters.filters}
            onRemoveFilter={filters.remove}
          />
        </div>
      )}
    </div>
  );
};
