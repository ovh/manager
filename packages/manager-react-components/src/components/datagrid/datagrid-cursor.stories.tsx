import React, { useState } from 'react';
import { ColumnSort } from '@tanstack/react-table';
import { withRouter } from 'storybook-addon-react-router-v6';
import { applyFilters } from '@ovh-ux/manager-core-api';
import { useSearchParams } from 'react-router-dom';
import { Datagrid } from './datagrid.component';
import { useColumnFilters } from '../filters';
import { columsTmp, columsFilters, Item } from './datagrid.mock';

const DatagridStory = ({
  items,
  isSortable,
  columns = columsTmp,
}: {
  items: Item[];
  isSortable: boolean;
  columns?: any;
}) => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(items);
  const [searchParams] = useSearchParams();
  const { filters, addFilter, removeFilter } = useColumnFilters();

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
        items={applyFilters(data, filters)}
        totalItems={data.length}
        hasNextPage={data.length > 0 && data.length < 30}
        onFetchNextPage={fetchNextPage}
        filters={{ filters, add: addFilter, remove: removeFilter }}
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

export const Empty: any = {
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

export const Filters = {
  args: {
    items: [...Array(10).keys()].map((_, i) => ({
      label: `Item #${i}`,
      price: Math.floor(1 + Math.random() * 100),
    })),
    isSortable: true,
    columns: columsFilters,
  },
};

export default {
  title: 'Components/Datagrid Cursor',
  component: DatagridStory,
  decorators: [withRouter],
};
