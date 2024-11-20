import React from 'react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { useSearchParams } from 'react-router-dom';
import { FilterCategories, applyFilters } from '@ovh-ux/manager-core-api';
import { Datagrid } from './datagrid.component';
import { DataGridTextCell } from './text-cell.component';
import { useDatagridSearchParams } from './useDatagridSearchParams';
import { useColumnFilters } from '../filters';

interface Item {
  label: string;
  price: number;
}

export const columsTmp = [
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

export const columsFilters = [
  {
    id: 'label',
    cell: (item: Item) => {
      return <DataGridTextCell>{item.label}</DataGridTextCell>;
    },
    label: 'Label',
    comparator: FilterCategories.String,
  },
  {
    id: 'price',
    cell: (item: Item) => {
      return <DataGridTextCell>{item.price} €</DataGridTextCell>;
    },
    label: 'Price',
    comparator: FilterCategories.String,
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
  columns = columsTmp,
}: {
  items: Item[];
  isPaginated: boolean;
  isSortable: boolean;
  columns?: any;
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
  const { filters, addFilter, removeFilter } = useColumnFilters();

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
        items={applyFilters(
          sortItems(items, sorting).slice(start, end),
          filters,
        )}
        totalItems={items.length}
        {...paginationAttrs}
        {...sortingAttrs}
        filters={{ filters, add: addFilter, remove: removeFilter }}
      />
    </>
  );
};

export const Basic = DatagridStory.bind({});

Basic.args = {
  columns: columsTmp,
  items: [...Array(50).keys()].map((_, i) => ({
    label: `Item #${i}`,
    price: Math.floor(1 + Math.random() * 100),
  })),
  isPaginated: true,
  isSortable: true,
};

export const Sortable = DatagridStory.bind({});

Sortable.args = {
  columns: columsTmp,
  items: [...Array(8).keys()].map((_, i) => ({
    label: `Service #${i}`,
    price: Math.floor(1 + Math.random() * 100),
  })),
  isSortable: true,
};

export const Filters = {
  args: {
    items: [...Array(50).keys()].map((_, i) => ({
      label: `Item #${i}`,
      price: Math.floor(1 + Math.random() * 100),
    })),
    isPaginated: true,
    isSortable: true,
    columns: columsFilters,
  },
};

export default {
  title: 'Components/Datagrid Paginated',
  component: Datagrid,
  decorators: [withRouter],
  parameters: {
    status: {
      type: 'deprecated',
    },
    docs: {
      description: {
        component:
          'The `Datagrid` component in pagination mode is now `deprecated`. Please switch to the cursor navigation mode',
      },
    },
  },
};
