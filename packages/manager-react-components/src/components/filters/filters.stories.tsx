import React, { useState } from 'react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsIcon,
  OsdsPopoverContent,
  OsdsSearchBar,
  OsdsPopover,
} from '@ovhcloud/ods-components/react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  FilterComparator,
  FilterCategories,
} from '../../hooks/useCoreApiClient';
import { FilterAdd } from './filter-add.component';
import { FilterList } from './filter-list.component';
import { useColumnFilters } from './useColumnFilters';

const FiltersStory = () => {
  const [searchField, setSearchField] = useState('');
  const { filters, addFilter, removeFilter } = useColumnFilters();

  return (
    <>
      <div className="flex justify-center">
        <OsdsSearchBar
          className="w-[30%] mr-5"
          value={searchField}
          onOdsSearchSubmit={({ detail }) => {
            addFilter({
              key: 'username',
              value: detail.inputValue,
              comparator: FilterComparator.Includes,
              label: 'Username',
            });
            setSearchField('');
          }}
        />
        <OsdsPopover>
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
            Filter
          </OsdsButton>
          <OsdsPopoverContent>
            <FilterAdd
              columns={[
                {
                  id: 'username',
                  label: 'Username',
                  comparators: FilterCategories.String,
                },
              ]}
              onAddFilter={(addedFilter, column) => {
                addFilter({
                  ...addedFilter,
                  label: column.label,
                });
              }}
            />
          </OsdsPopoverContent>
        </OsdsPopover>
      </div>
      <div className="my-5">
        <FilterList filters={filters} onRemoveFilter={removeFilter} />
      </div>
    </>
  );
};

export const DefaultProps = {
  args: {},
};

export default {
  title: 'Components/filters',
  component: FiltersStory,
  decorators: [withRouter],
};
