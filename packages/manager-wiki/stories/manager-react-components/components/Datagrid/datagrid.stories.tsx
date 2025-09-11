import React, { useState } from 'react';
import { Datagrid, DatagridProps } from '@ovh-ux/manager-react-components';
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
  return (
    <Datagrid
      columns={cols}
      data={items}
      {...('manualSorting' in args && { ...sortAttrs })}
      {...('onFetchAllPages' in args &&
        !isFetchAll && {
          hasNextPage: true,
          onFetchAllPages: () => {
            setIsFetchAll(true);
            const newItems = Array.from({ length: 20 }, () => ({
              person: `Person ${items.length + 1}`,
              mostInterestIn: `Most interest in ${items.length + 1}`,
              age: items.length + 1,
            }));
            setItems([...items, ...newItems]);
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
  );
};

export const Default = DatagridStory.bind({});

Default.args = {
  columns,
  data,
};

Default.parameters = {
  docs: {
    description: {
      story:
        'Basic datagrid without pagination controls. Shows a simple table with data.',
    },
  },
};

export const DatagridWithSorting = DatagridStory.bind({});

DatagridWithSorting.args = {
  columns,
  data,
  manualSorting: false,
};

DatagridWithSorting.parameters = {
  docs: {
    description: {
      story:
        'Datagrid with client-side sorting enabled. Click on column headers to sort the data.',
    },
  },
};

export const DatagridWithLoadMore = DatagridStory.bind({});

DatagridWithLoadMore.args = {
  columns,
  data,
  manualSorting: false,
  hasNextPage: true,
  onFetchNextPage: () => {},
};

DatagridWithLoadMore.parameters = {
  docs: {
    description: {
      story:
        'Datagrid with "Load More" pagination. Click the "Load More" button to fetch additional data incrementally.',
    },
  },
};

export const DatagridWithLoadAll = DatagridStory.bind({});

DatagridWithLoadAll.args = {
  columns,
  data,
  manualSorting: false,
  hasNextPage: true,
  onFetchAllPages: () => {},
};

DatagridWithLoadAll.parameters = {
  docs: {
    description: {
      story:
        'Datagrid with "Load All" pagination. Click the "Load All" button to fetch all remaining data at once.',
    },
  },
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

DatagridWithLoadAllAndLoading.parameters = {
  docs: {
    description: {
      story:
        'Complete pagination example with both "Load More" and "Load All" buttons. Toggle the `isLoading` control to see loading states on the buttons.',
    },
  },
};

export const DatagridWithLoadingState = DatagridStory.bind({});

DatagridWithLoadingState.args = {
  columns,
  data,
  manualSorting: false,
  hasNextPage: true,
  onFetchAllPages: () => {},
  onFetchNextPage: () => {},
  isLoading: true,
};

DatagridWithLoadingState.parameters = {
  docs: {
    description: {
      story:
        'Datagrid with loading state active. Both pagination buttons are disabled and show loading indicators.',
    },
  },
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
