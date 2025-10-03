import React, { useState } from 'react';
import {
  FilterCategories,
  FilterComparator,
  FilterTypeCategories,
} from '@ovh-ux/manager-core-api';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsPopover,
  OdsInput,
} from '@ovhcloud/ods-components/react';
import { withRouter } from 'storybook-addon-react-router-v6';
import {
  FilterAdd,
  FilterList,
  useColumnFilters,
} from '@ovh-ux/manager-ui-kit';

const FiltersStory = () => {
  const [searchField, setSearchField] = useState('');
  const { filters, addFilter, removeFilter } = useColumnFilters();

  return (
    <>
      <div className="flex justify-center">
        <OdsInput
          name="ods-input-username"
          className="w-[30%] mr-2"
          value={searchField}
          onOdsChange={({ detail }) => setSearchField(detail.value as string)}
        />
        <OdsButton
          label=""
          icon={ODS_ICON_NAME.magnifyingGlass}
          className="mr-5"
          size={ODS_BUTTON_SIZE.sm}
          onClick={() => {
            addFilter({
              key: 'username',
              value: searchField,
              comparator: FilterComparator.Includes,
              label: 'Username',
            });
            setSearchField('');
          }}
        />
        <div id="popover-trigger">
          <OdsButton
            slot="popover-trigger"
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.outline}
            icon={ODS_ICON_NAME.filter}
            label="Filter"
          />
        </div>
        <OdsPopover triggerId="popover-trigger" with-arrow>
          <FilterAdd
            columns={[
              {
                id: 'username',
                label: 'Username',
                comparators: FilterCategories.String,
              },
              {
                id: 'createdAt',
                label: 'Created at',
                comparators: FilterCategories.Date,
                type: FilterTypeCategories.Date,
              },
              {
                id: 'status',
                label: 'Status',
                comparators: FilterCategories.Options,
                options: [
                  { label: 'Status #0', value: 'Status #0' },
                  { label: 'Status #1', value: 'Status #1' },
                ],
              },
              {
                id: 'anotherStatus',
                label: 'anotherStatus',
                comparators: FilterCategories.Options,
                options: [
                  {
                    label: 'anotherStatus #0000000000000000000000',
                    value: 'anotherStatus #0000000000000000000000',
                  },
                  { label: 'anotherStatus #1', value: 'anotherStatus #1' },
                ],
              },
            ]}
            onAddFilter={(addedFilter, column) => {
              addFilter({
                ...addedFilter,
                label: column.label,
              });
            }}
          />
        </OdsPopover>
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

const meta = {
  title: 'Manager UI Kit/Components/Filters',
  component: FiltersStory,
  decorators: [withRouter],
};

export default meta;
