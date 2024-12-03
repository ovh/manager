import React, { useState } from 'react';
import { ColumnSort } from '@tanstack/react-table';
import { withRouter } from 'storybook-addon-react-router-v6';
import { Datagrid } from './datagrid.component';
import { DataGridTextCell } from './text-cell.component';

interface Item {
  label: string;
  price: number;
}

const columns = [
  {
    id: 'label',
    cell: (item: Item) => {
      return <DataGridTextCell>{item.label}</DataGridTextCell>;
    },
    label: 'Label',
  },
  {
    id: 'price',
    cell: (item: Item) => {
      return <DataGridTextCell>{item.price} €</DataGridTextCell>;
    },
    label: 'Price',
  },
];

const DatagridStory = (args) => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);

  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
      label: `Item #${i + itemsIndex}`,
      price: Math.floor(1 + Math.random() * 100),
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };

  return (
    <>
      <Datagrid
        columns={columns}
        items={data}
        totalItems={data?.length}
        hasNextPage={data?.length > 0 && data.length < 30}
        onFetchNextPage={fetchNextPage}
        {...(args.isSortable
          ? {
              sorting,
              onSortChange: setSorting,
              manualSorting: false,
            }
          : {})}
      />
    </>
  );
};

export const Basic = DatagridStory.bind({});

Basic.args = {
  columns: columns,
  items: [...Array(10).keys()].map((_, i) => ({
    label: `Item #${i}`,
    price: Math.floor(1 + Math.random() * 100),
  })),
  totalItems: 20,
  isSortable: false,
  onFetchNextPage: true,
};

export const Empty = DatagridStory.bind({});

Empty.args = {
  columns: columns,
  items: [],
};

export const Sortable = DatagridStory.bind({});

Sortable.args = {
  columns: columns,
  items: [...Array(10).keys()].map((_, i) => ({
    label: `Item #${i}`,
    price: Math.floor(1 + Math.random() * 100),
  })),
  isSortable: true,
};

export default {
  title: 'Components/Datagrid Cursor',
  component: Datagrid,
  decorators: [withRouter],
};
