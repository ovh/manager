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
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
  Icon,
  ICON_NAME,
} from '@ovhcloud/ods-react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { FilterAdd, FilterList, useColumnFilters } from '@ovh-ux/muk';

const FiltersStory = () => {
  const [searchField, setSearchField] = useState('');
  const { filters, addFilter, removeFilter } = useColumnFilters();

  return (
    <>
      <div className="flex justify-center">
        <Input
          name="ods-input-username"
          className="w-[30%] mr-2"
          value={searchField}
          onChange={(event) => setSearchField(event.target.value)}
        />
        <Button
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
        >
          <Icon name={ICON_NAME.magnifyingGlass} />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button size={BUTTON_SIZE.sm} variant={BUTTON_VARIANT.outline}>
              <Icon name={ICON_NAME.filter} />
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent>
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
          </PopoverContent>
        </Popover>
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
