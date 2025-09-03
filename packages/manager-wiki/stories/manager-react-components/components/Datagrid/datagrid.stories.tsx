import React from 'react';
import { Meta } from '@storybook/react';
import { Datagrid } from '@ovh-ux/manager-react-components';

const datagridDefault = {
  args: {
    columns: [
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
    ],
    data: [
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
    ],
  },
};

const meta: Meta = {
  title: 'Manager React Components/Components/Datagrid New',
  component: Datagrid,
  parameters: {
    docs: {
      description: {
        component:
          'The `Datagrid` component in pagination mode is now `deprecated`. Please switch to the cursor navigation mode',
      },
    },
  },
};

export default meta;

export const Default = () => <Datagrid {...datagridDefault.args} />;
