import React from 'react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { useSearchParams } from 'react-router-dom';
import { applyFilters } from '@ovh-ux/manager-core-api';
import { Row } from '@tanstack/react-table';
import {
  Datagrid,
  useDatagridSearchParams,
  useColumnFilters,
  DataGridTextCell,
} from '@ovh-ux/muk';
import { columns as clm, columnsFilters, Item } from './datagrid.mock';

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
  isLoading = false,
  columns = clm,
  getRowCanExpand,
  renderSubComponent,
}: {
  items: Item[];
  isLoading: boolean;
  isPaginated: boolean;
  isSortable: boolean;
  columns?: any;
  renderSubComponent?: (props: Row<any>) => JSX.Element;
  getRowCanExpand?: (row: Row<any>) => boolean;
}) => {
  const [searchParams] = useSearchParams();
  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
  } = useDatagridSearchParams({
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
        isLoading={isLoading}
        {...paginationAttrs}
        {...sortingAttrs}
        filters={{ filters, add: addFilter, remove: removeFilter }}
        getRowCanExpand={getRowCanExpand}
        renderSubComponent={renderSubComponent}
      />
    </>
  );
};

export const Basic = DatagridStory.bind({});

Basic.args = {
  columns: clm,
  items: [...Array(50).keys()].map((_, i) => ({
    label: `Item #${i}`,
    price: Math.floor(1 + Math.random() * 100),
  })),
  isPaginated: true,
  isSortable: true,
};

export const Loading = DatagridStory.bind({});

Loading.args = {
  columns: clm,
  items: [],
  isLoading: true,
};

export const Sortable = DatagridStory.bind({});

Sortable.args = {
  columns: clm,
  items: [...Array(8).keys()].map((_, i) => ({
    label: `Service #${i}`,
    price: Math.floor(1 + Math.random() * 100),
  })),
  isSortable: true,
};

export const Filters = DatagridStory.bind({});

Filters.args = {
  items: [...Array(50).keys()].map((_, i) => ({
    label: `Item #${i}`,
    price: Math.floor(1 + Math.random() * 100),
  })),
  isPaginated: true,
  isSortable: true,
  columns: columnsFilters,
};

export const WithSubComponent = DatagridStory.bind({});

WithSubComponent.args = {
  columns: clm,
  items: [...Array(10).keys()].map((_, i) => ({
    label: `Item #${i}`,
    price: Math.floor(1 + Math.random() * 100),
  })),
  getRowCanExpand: () => true,
  renderSubComponent: (row) => (
    <DataGridTextCell>{JSON.stringify(row.original)}</DataGridTextCell>
  ),
};

export default {
  title: 'Manager UI Kit/Components/Datagrid Paginated',
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
