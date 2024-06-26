import React from 'react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { useSearchParams } from 'react-router-dom';
import { Datagrid } from './datagrid.component';
import { DataGridTextCell } from './text-cell.component';
import { useDatagridSearchParams } from './useDatagridSearchParams';

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

function sortItems(
  itemList: Item[],
  sorting: { id: string; desc: boolean },
): Item[] {
  if (!sorting) return itemList;
  const order = sorting.desc ? -1 : 1;
  if (sorting.id === 'label')
    return itemList.sort((a, b) => order * a.label.localeCompare(b.label));
  if (sorting.id === 'price')
    return itemList.sort((a, b) => order * (a.price - b.price));
  return itemList;
}

const DatagridStory = ({
  items,
  isPaginated,
  isSortable,
}: {
  items: Item[];
  isPaginated: boolean;
  isSortable: boolean;
}) => {
  const [searchParams] = useSearchParams();
  const { pagination, setPagination, sorting, setSorting } =
    useDatagridSearchParams({
      id: 'validityTo',
      desc: false,
    });
  const start = isPaginated ? pagination.pageIndex * pagination.pageSize : 0;
  const end = isPaginated ? start + pagination.pageSize : items.length;
  const paginationAttrs = isPaginated && {
    pagination,
    onPaginationChange: setPagination,
  };
  const sortingAttrs = isSortable && {
    sorting,
    onSortChange: setSorting,
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
        items={sortItems(items, sorting).slice(start, end)}
        totalItems={items.length}
        {...paginationAttrs}
        {...sortingAttrs}
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
    items: [...Array(15).keys()].map((_, i) => ({
      label: `Item #${i}`,
      price: Math.floor(1 + Math.random() * 100),
    })),
  },
};

export const Sortable = {
  args: {
    items: [...Array(15).keys()].map((_, i) => ({
      label: `Item #${i}`,
      price: Math.floor(1 + Math.random() * 100),
    })),
    isSortable: true,
  },
};

export const Pagination = {
  args: {
    items: [...Array(50).keys()].map((_, i) => ({
      label: `Item #${i}`,
      price: Math.floor(1 + Math.random() * 100),
    })),
    isPaginated: true,
    isSortable: true,
  },
};

export default {
  title: 'Components/Datagrid Paginated',
  component: DatagridStory,
  decorators: [withRouter],
};
