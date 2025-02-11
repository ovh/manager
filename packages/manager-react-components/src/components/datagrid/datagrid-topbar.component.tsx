import React, { useRef } from 'react';
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
import { FilterComparator } from '@ovh-ux/manager-core-api';
import { FilterWithLabel } from '../filters/interface';
import { FilterAdd, FilterList } from '../filters';
import { ColumnFilter } from '../filters/filter-add.component';
import './translations';

type ColumnFilterProps = {
  key: string;
  value: string | string[];
  comparator: FilterComparator;
  label: string;
};

export interface SearchProps {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  onSearch: (search: string) => void;
}

export interface FilterProps {
  filters: FilterWithLabel[];
  add: (filters: ColumnFilterProps) => void;
  remove: (filter: FilterWithLabel) => void;
}

export interface DatagridTopbarProps {
  filtersColumns?: ColumnFilter[];
  isSearchable?: boolean;
  filters?: FilterProps;
  search?: SearchProps;
  topbar?: React.ReactNode;
}

export const DatagridTopbar = <T,>({
  filters,
  filtersColumns,
  isSearchable,
  search,
  topbar,
}: DatagridTopbarProps) => {
  const { t } = useTranslation('filters');
  const filterPopoverRef = useRef(null);

  return (
    <>
      {(isSearchable || filtersColumns?.length > 0 || topbar) && (
        <div id="container" className="flex flex-wrap justify-between py-6">
          <div id="left-side" className="w-full md:w-auto md:order-1">
            {topbar && <div>{topbar}</div>}
          </div>
          <div
            id="right-side"
            className="w-full mt-[10px] md:mt-[0px] md:w-auto md:order-3"
          >
            <div className="flex justify-end items-center">
              {isSearchable && (
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
                    onOdsChange={(event) =>
                      search?.setSearchInput(event?.detail?.value?.toString())
                    }
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
              {filtersColumns?.length > 0 && (
                <div
                  className="ml-[10px]"
                  data-testid="datagrid-topbar-filters"
                >
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
                      columns={filtersColumns}
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
          </div>
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
    </>
  );
};
