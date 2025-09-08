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

const DatagridStory = (args: DatagridProps<any>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  return <Datagrid {...args} sorting={sorting} onSortChange={setSorting} />;
};

export const Basic = DatagridStory.bind({});

Basic.args = {
  columns,
  data,
};

export default {
  title: 'Manager React Components/Components/Datagrid New',
  component: Datagrid,
  decorators: [withRouter],
  parameters: {
    docs: {
      description: {
        component:
          'The `Datagrid` component in pagination mode is now `deprecated`. Please switch to the cursor navigation mode',
      },
    },
  },
};
