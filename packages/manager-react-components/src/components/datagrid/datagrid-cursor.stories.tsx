import React, { useState } from 'react';
import { ColumnSort } from '@tanstack/react-table';
import { withRouter } from 'storybook-addon-react-router-v6';
import { useSearchParams } from 'react-router-dom';
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

const DatagridStory = ({
  items,
  isSortable,
}: {
  items: Item[];
  isSortable: boolean;
}) => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(items);
  const [searchParams] = useSearchParams();

  const fetchNextPage = () => {
    const itemsIndex = data.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
      label: `Item #${i + itemsIndex}`,
      price: Math.floor(1 + Math.random() * 100),
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };

  return (
    <>
      {`${searchParams}` && (
        <>
          <pre>Search params: ?{`${searchParams}`}</pre>
          <hr />
        </>
      )}
      <Datagrid
        columns={columns}
        items={data}
        totalItems={data.length}
        hasNextPage={data.length > 0 && data.length < 30}
        onFetchNextPage={fetchNextPage}
        {...(isSortable
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

export const Empty = {
  args: {
    items: [],
  },
};

export const Basic = {
  args: {
    items: [...Array(10).keys()].map((_, i) => ({
      label: `Item #${i}`,
      price: Math.floor(1 + Math.random() * 100),
    })),
    isSortable: false,
  },
};

export const Sortable = {
  args: {
    items: [...Array(10).keys()].map((_, i) => ({
      label: `Item #${i}`,
      price: Math.floor(1 + Math.random() * 100),
    })),
    isSortable: true,
  },
};

export default {
  title: 'Components/Datagrid Cursor',
  component: DatagridStory,
  decorators: [withRouter],
};
