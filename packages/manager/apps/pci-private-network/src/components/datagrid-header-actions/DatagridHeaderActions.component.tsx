import { FC, useState, useRef } from 'react';
import {
  OsdsButton,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  FilterAdd,
  FilterList,
  PaginationState,
  useColumnFilters,
} from '@ovh-ux/manager-react-components';
import { Filter, FilterComparator } from '@ovh-ux/manager-core-api';

type ColumnFilter = {
  id: string;
  label: string;
  comparators: FilterComparator[];
};

type Props = {
  createLabel: string;
  columnFilters: ColumnFilter[];
  pagination: PaginationState;
  setPagination: (pagination: PaginationState) => void;
  onCreate?: () => void;
};

const DataGridHeaderActions: FC<Props> = ({
  createLabel,
  columnFilters,
  pagination,
  setPagination,
  onCreate,
}) => {
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [searchField, setSearchField] = useState<string>('');
  const filterPopoverRef = useRef(undefined);

  const initializePagination = () => {
    setPagination({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    });
  };

  const onSearch = ({ detail }) => {
    initializePagination();
    addFilter({
      key: 'search',
      value: detail.inputValue,
      comparator: FilterComparator.Includes,
      label: '',
    });
    setSearchField('');
  };

  const onAddFilter = (addedFilter: Filter, column: ColumnFilter) => {
    initializePagination();
    addFilter({
      ...addedFilter,
      label: column.label,
    });
  };

  return (
    <>
      <div className="flex items-center justify-between my-5">
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.stroked}
          inline
          onClick={onCreate}
        >
          <OsdsIcon
            name={ODS_ICON_NAME.ADD}
            size={ODS_ICON_SIZE.xxs}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="mr-3"
          />
          {createLabel}
        </OsdsButton>
        <div className="flex items-center">
          <OsdsSearchBar value={searchField} onOdsSearchSubmit={onSearch} />
          <OsdsPopover ref={filterPopoverRef}>
            <OsdsButton
              slot="popover-trigger"
              size={ODS_BUTTON_SIZE.sm}
              color={ODS_THEME_COLOR_INTENT.primary}
              variant={ODS_BUTTON_VARIANT.stroked}
              className="ml-4"
            >
              <OsdsIcon
                name={ODS_ICON_NAME.FILTER}
                size={ODS_ICON_SIZE.xs}
                color={ODS_THEME_COLOR_INTENT.primary}
                className="mr-7"
              />
            </OsdsButton>
            <OsdsPopoverContent>
              <FilterAdd
                columns={columnFilters}
                onAddFilter={(addedFilter, column) => {
                  onAddFilter(addedFilter, column);
                  filterPopoverRef.current?.closeSurface();
                }}
              />
            </OsdsPopoverContent>
          </OsdsPopover>
        </div>
      </div>
      <div className="my-8">
        <FilterList filters={filters} onRemoveFilter={removeFilter} />
      </div>
    </>
  );
};

export default DataGridHeaderActions;
