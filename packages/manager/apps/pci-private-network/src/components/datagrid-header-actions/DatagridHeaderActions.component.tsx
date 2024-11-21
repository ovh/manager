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
  OsdsSearchBarCustomEvent,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { FilterAdd, FilterList } from '@ovh-ux/manager-react-components';
import { Filter, FilterComparator } from '@ovh-ux/manager-core-api';

export type ColumnFilter = {
  id: string;
  label: string;
  comparators: FilterComparator[];
};

type Props = {
  createLabel: string;
  filters: Array<
    Filter & {
      label: string;
    }
  >;
  onCreate?: () => void;
  onSearch: (
    event: OsdsSearchBarCustomEvent<{
      optionValue: string;
      inputValue: string;
    }>,
  ) => void;
  removeFilter: (filter: Filter) => void;
  columnFilters: ColumnFilter[];
  handleAddFilter: (filter: Filter, column: ColumnFilter) => void;
};

const DataGridHeaderActions: FC<Props> = ({
  createLabel,
  filters,
  columnFilters,
  onCreate,
  onSearch,
  removeFilter,
  handleAddFilter,
}) => {
  const [searchField, setSearchField] = useState<string>('');
  const filterPopoverRef = useRef(undefined);

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
          <OsdsButton
            className="mr-4"
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_BUTTON_VARIANT.stroked}
            size={ODS_BUTTON_SIZE.sm}
            inline
          >
            <OsdsIcon
              name={ODS_ICON_NAME.REFRESH}
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_ICON_SIZE.xs}
              className="mr-7"
            />
          </OsdsButton>
          <OsdsSearchBar
            value={searchField}
            onOdsSearchSubmit={(event) => {
              onSearch(event);
              setSearchField('');
            }}
          />
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
                className={'mr-7'}
              />
            </OsdsButton>
            <OsdsPopoverContent>
              <FilterAdd
                columns={columnFilters}
                onAddFilter={(addedFilter, column) => {
                  handleAddFilter(addedFilter, column);
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
