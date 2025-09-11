import React, { useState } from 'react';
import {
  Datagrid,
  DatagridProps,
  Text,
} from '@ovh-ux/manager-react-components';
import { FormField, FormFieldLabel, Input, Button } from '@ovhcloud/ods-react';
import { SortingState } from '@tanstack/react-table';
import { withRouter } from 'storybook-addon-react-router-v6';

const columns = [
  {
    id: 'person',
    label: 'Person',
    accessorKey: 'person',
    header: 'Person',
    cell: ({ getValue }) => <div>{getValue()}</div>,
  },
  {
    id: 'mostInterestIn',
    label: 'Most interest in',
    accessorKey: 'mostInterestIn',
    header: 'Most interest in',
    cell: ({ getValue }) => <div>{getValue()}</div>,
  },
  {
    id: 'age',
    label: 'Age',
    accessorKey: 'age',
    header: 'Age',
    cell: ({ getValue }) => <div>{getValue()}</div>,
  },
];

const data = [
  {
    person: 'John Doe',
    mostInterestIn: '	HTML tables',
    age: 25,
  },
  {
    person: 'Jane Doe',
    mostInterestIn: 'Web accessibility',
    age: 26,
  },
  {
    person: 'Sarah',
    mostInterestIn: 'JavaScript frameworks',
    age: 25,
  },
  {
    person: 'Karen',
    mostInterestIn: '	Web performance',
    age: 26,
  },
];

const DatagridStory = (args: DatagridProps<Record<string, unknown>>) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const sortAttrs = {
    sorting,
    onSortChange: setSorting,
    manualSorting: args.manualSorting,
  };
  const [isFetchAll, setIsFetchAll] = useState(false);
  const [items, setItems] = useState(args.data);
  const cols = args.columns;
  // const containerHeight = args.containerHeight;
  const fetchAllPages = () => {
    const newData = Array.from({ length: 10000 }, (_, index) => ({
      ...items[index],
      person: `Most interest in ${items.length + index}`,
      mostInterestIn: `Most interest in ${items.length + index}`,
      age: index + 1,
    }));
    setItems([...items, ...newData]);
  };

  const [containerHeightState, setContainerHeightState] = useState(
    args.containerHeight,
  );
  const [containerHeightStyle, setContainerHeightStyle] = useState(
    args.containerHeight,
  );

  return (
    <>
      {'onFetchNextPage' in args && (
        <div className="py-4">
          <Text>
            <b>Notice:</b> You are currently running React in development mode.
            Virtualized rendering performance will be slightly degraded until
            this application is built for production. ({items?.length} of 10000
            rows fetched)
          </Text>
        </div>
      )}
      {'containerHeight' in args && (
        <div className="py-4">
          <div className="max-w-[200px]">
            <FormField>
              <FormFieldLabel>Container Height</FormFieldLabel>
              <Input
                value={containerHeightState}
                onChange={(e) => setContainerHeightState(e.target.value)}
              />
              <Button
                onClick={() => setContainerHeightStyle(containerHeightState)}
              >
                Update
              </Button>
            </FormField>
          </div>
        </div>
      )}
      <Datagrid
        columns={cols}
        data={items}
        {...(containerHeightStyle && { containerHeight: containerHeightStyle })}
        {...('manualSorting' in args && { ...sortAttrs })}
        {...('onFetchAllPages' in args &&
          !isFetchAll && {
            hasNextPage: true,
            onFetchAllPages: () => {
              setIsFetchAll(true);
              fetchAllPages();
            },
          })}
        {...('onFetchNextPage' in args &&
          !isFetchAll && {
            hasNextPage: true,
            onFetchNextPage: () =>
              setItems([
                ...items,
                {
                  person: `Person ${items.length + 1}`,
                  mostInterestIn: `Most interest in ${items.length + 1}`,
                  age: items.length + 1,
                },
              ]),
          })}
      />
    </>
  );
};

export const Default = DatagridStory.bind({});

Default.args = {
  columns,
  data,
};

export const DatagridWithSorting = DatagridStory.bind({});

DatagridWithSorting.args = {
  columns,
  data,
  manualSorting: false,
};

export const DatagridWithLoadMore = DatagridStory.bind({});

DatagridWithLoadMore.args = {
  columns,
  data,
  manualSorting: false,
  hasNextPage: true,
  onFetchNextPage: () => {},
};

export const DatagridWithLoadAll = DatagridStory.bind({});

DatagridWithLoadAll.args = {
  columns,
  data,
  manualSorting: false,
  hasNextPage: true,
  onFetchAllPages: () => {},
};

export const DatagridWithLoadAllAndLoading = DatagridStory.bind({});

DatagridWithLoadAllAndLoading.args = {
  columns,
  data,
  manualSorting: false,
  hasNextPage: true,
  onFetchAllPages: () => {},
  onFetchNextPage: () => {},
};

export const DatagridWithContainerHeight = DatagridStory.bind({});

DatagridWithContainerHeight.args = {
  columns,
  data,
  manualSorting: false,
  hasNextPage: true,
  onFetchAllPages: () => {},
  onFetchNextPage: () => {},
  containerHeight: '240px',
};

const meta = {
  title: 'Manager React Components/Components/Datagrid New',
  component: Datagrid,
  decorators: [withRouter],
  parameters: {
    docs: {
      description: {
        component:
          'The `Datagrid` component provides a powerful data table with built-in pagination controls. The footer actions section includes "Load More" and "Load All" buttons for progressive data loading.',
      },
    },
  },
  argTypes: {
    hasNextPage: {
      description: 'Controls whether pagination buttons are shown',
      control: 'boolean',
    },
    onFetchNextPage: {
      description: 'Callback function triggered when "Load More" is clicked',
      action: 'fetchNextPage',
    },
    onFetchAllPages: {
      description: 'Callback function triggered when "Load All" is clicked',
      action: 'fetchAllPages',
    },
    isLoading: {
      description: 'Shows loading state on pagination buttons',
      control: 'boolean',
    },
  },
};

export default meta;
