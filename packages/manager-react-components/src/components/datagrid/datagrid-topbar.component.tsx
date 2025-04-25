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
import { VisibilityManagement } from './visibility/visibility-management.component';
import { ColumnsVisibility } from './datagrid.constants';

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
  placeholder?: string;
}

export interface FilterProps {
  filters: FilterWithLabel[];
  add: (filters: ColumnFilterProps) => void;
  remove: (filter: FilterWithLabel) => void;
}

export interface DatagridTopbarProps {
  columnsVisibility?: ColumnsVisibility[];
  filtersColumns?: ColumnFilter[];
  isSearchable?: boolean;
  filters?: FilterProps;
  search?: SearchProps;
  topbar?: React.ReactNode;
}

export const DatagridTopbar = <T,>({
  columnsVisibility,
  filters,
  filtersColumns,
  isSearchable,
  search,
  topbar,
}: DatagridTopbarProps) => {
  const { t } = useTranslation('filters');
  const filterPopoverRef = useRef(null);
  const hasVisibilityFeature = columnsVisibility?.some(
    (col) => col.enableHiding,
  );

  return (
    <>
      {(isSearchable ||
        filtersColumns?.length > 0 ||
        topbar ||
        hasVisibilityFeature) && (
        <div id="container" className="flex flex-wrap justify-between pb-6">
          <div id="left-side" className="w-full md:w-auto md:order-1">
            {topbar && <div>{topbar}</div>}
          </div>
          <div
            id="right-side"
            className="w-full mt-[10px] md:mt-[0px] md:w-auto md:order-3"
          >
            <div className="flex justify-end items-center">
              {isSearchable && (
                <form
                  className="mr-[5px]"
                  onSubmit={(e) => {
                    e.preventDefault();
                    search?.onSearch(search?.searchInput);
                  }}
                >
                  <OdsInput
                    isClearable
                    onOdsClear={() => {
                      search?.onSearch('');
                      search?.setSearchInput('');
                    }}
                    type={ODS_INPUT_TYPE.search}
                    id="datagrid-searchbar"
                    name="datagrid-searchbar"
                    placeholder={search?.placeholder}
                    defaultValue={search?.searchInput}
                    data-testid="datagrid-searchbar"
                    onOdsChange={(event) =>
                      search?.setSearchInput(
                        event?.detail?.value?.toString() || '',
                      )
                    }
                    value={search?.searchInput}
                  />
                </form>
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
                    variant={ODS_BUTTON_VARIANT.outline}
                    icon={ODS_ICON_NAME.filter}
                    aria-label={t('common_criteria_adder_filter_label')}
                    label={t('common_criteria_adder_filter_label')}
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
              {hasVisibilityFeature && (
                <div className={filtersColumns?.length > 0 ? 'ml-[10px]' : ''}>
                  <VisibilityManagement columnsVisibility={columnsVisibility} />
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
