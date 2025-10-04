import React, { useState, useMemo } from 'react';
import { ColumnSort } from '@tanstack/react-table';
import { OdsDivider, OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { FilterComparator, applyFilters } from '@ovh-ux/manager-core-api';
import { withRouter } from 'storybook-addon-react-router-v6';
import { useSearchParams } from 'react-router-dom';
import {
  IamObject,
  Datagrid,
  useColumnFilters,
  ActionMenu,
  DataGridTextCell,
} from '@ovh-ux/muk';
import {
  columns,
  columnsFilters,
  columnsVisibility,
  columnsSearchAndFilters,
  columnsFiltersWithTags,
} from './datagrid.mock';

interface Item {
  label: string;
  price: number;
  actions: React.ReactElement;
}

const pageSize = 10;
const maxPages = 3;

const DatagridStory = (args) => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const [rowSelection, setRowSelection] = useState({});

  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize).keys()].map((_, i) => ({
      label: `Item #${i + itemsIndex}`,
      price: Math.floor(1 + Math.random() * 100),
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };

  const fetchAllPages = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize * maxPages - itemsIndex).keys()].map(
      (_, i) => ({
        label: `Item #${i + itemsIndex}`,
        price: Math.floor(1 + Math.random() * 100),
      }),
    );
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };

  const columnSearchable = useMemo(
    () =>
      args?.columns?.find((item) =>
        Object.prototype.hasOwnProperty.call(item, 'isSearchable'),
      ),
    [columns],
  );

  const onSearch = (search: string) => {
    if (columnSearchable) {
      const tmp = applyFilters(
        args.items,
        !search || search.length === 0
          ? filters
          : [
              {
                key: columnSearchable.id,
                value: searchInput,
                comparator: FilterComparator.Includes,
              },
              ...filters,
            ],
      );
      setData(tmp);
    }
  };

  return (
    <>
      {`${searchParams}` && (
        <>
          <pre>Search params: ?{`${searchParams}`}</pre>
          <OdsDivider />
        </>
      )}
      <Datagrid
        items={applyFilters(data, filters)}
        columns={args.columns}
        hasNextPage={data?.length && data.length < maxPages * pageSize}
        onFetchNextPage={fetchNextPage}
        onFetchAllPages={fetchAllPages}
        totalItems={data?.length}
        filters={{ filters, add: addFilter, remove: removeFilter }}
        columnVisibility={args.columnVisibility}
        onColumnVisibilityChange={args.onColumnVisibilityChange}
        topbar={args.topbar}
        isLoading={args.isLoading}
        {...(args.search
          ? {
              search: {
                searchInput,
                setSearchInput,
                onSearch,
              },
            }
          : {})}
        getRowCanExpand={args.getRowCanExpand}
        renderSubComponent={args.renderSubComponent}
        {...(args.isSortable
          ? {
              sorting,
              onSortChange: setSorting,
              manualSorting: false,
            }
          : {})}
        rowSelection={
          args.rowSelection
            ? {
                rowSelection,
                setRowSelection,
                enableRowSelection: args.enableRowSelection,
                onToggleAllRowsSelection: args.onToggleAllRowsSelection,
                onRowSelectionChange: args.onRowSelectionChange,
              }
            : undefined
        }
      />
    </>
  );
};

export const Basic = DatagridStory.bind({});

Basic.args = {
  columns,
  items: [...Array(pageSize).keys()].map((_, i) => ({
    label: `Item #${i}`,
    price: Math.floor(1 + Math.random() * 100),
  })),
  totalItems: 20,
  isSortable: false,
  onFetchNextPage: true,
};

export const Empty = DatagridStory.bind({});

Empty.args = {
  columns,
  items: [],
};

export const Loading = DatagridStory.bind({});

Loading.args = {
  columns,
  items: [],
  isLoading: true,
};

export const Sortable = DatagridStory.bind({});

Sortable.args = {
  columns,
  items: [...Array(pageSize).keys()].map((_, i) => ({
    label: `Item #${i}`,
    price: Math.floor(1 + Math.random() * 100),
  })),
  isSortable: true,
};

const actionsColumns = {
  id: 'actions',
  cell: (item: Item) => {
    return item.actions;
  },
  label: '',
};

export const WithActions = DatagridStory.bind({});

WithActions.args = {
  columns: [...columns, actionsColumns],
  items: [...Array(pageSize).keys()].map((_, i) => {
    return {
      label: `Service #${i}`,
      price: Math.floor(1 + Math.random() * 100),
      actions: (
        <div className="flex items-center justify-center">
          <div>
            <ActionMenu
              isCompact={true}
              variant={ODS_BUTTON_VARIANT.ghost}
              id={i.toString()}
              items={[
                {
                  id: 1,
                  target: '_blank',
                  label: 'Action 1',
                  urn: 'urn:v9:eu:resource:manatestkds-fdsfsd',
                  iamActions: ['vrackServices:apiovh:iam/resource/update'],
                },
                {
                  id: 2,
                  target: '_blank',
                  label: 'Action 2',
                  urn: 'urn:v9:eu:resource:manate',
                  iamActions: ['vrackServices:apiovh:iam/resource/delete'],
                },
              ]}
            />
          </div>
        </div>
      ),
    };
  }),
  isSortable: true,
};

export const Filters = DatagridStory.bind({});

Filters.args = {
  items: [...Array(pageSize).keys()].map((_, i) => ({
    label: `Item #${i}`,
    price: Math.floor(1 + Math.random() * 100),
  })),
  columns: columnsFilters,
};

export const FiltersWithTags = DatagridStory.bind({});

FiltersWithTags.args = {
  items: [...Array(pageSize).keys()].map((_, i) => ({
    label: `Item #${i}`,
    price: Math.floor(1 + Math.random() * 100),
    iam: {
      id: 'test',
      urn: 'urn:v9:eu:resource:manatestkds-fdsfsd',
      tags: {
        key1: `tag-1-${i}`,
        key2: `tag-2-${i}`,
        [i]: `value-test`,
      },
    } as IamObject,
  })),
  columns: columnsFiltersWithTags,
};

export const Visibility = DatagridStory.bind({});

Visibility.args = {
  items: [...Array(pageSize).keys()].map((_, i) => ({
    label: `Item #${i}`,
    price: Math.floor(1 + Math.random() * 100),
  })),
  columns: columnsVisibility,
  onColumnVisibilityChange: undefined,
};

export const Topbar = DatagridStory.bind({});

const TopbarComponent = () => (
  <OdsButton label="Add item" icon={ODS_ICON_NAME.plus} />
);

Topbar.args = {
  items: [...Array(pageSize).keys()].map((_, i) => ({
    label: `Item #${i}`,
    price: Math.floor(1 + Math.random() * 100),
    status: `Status #${i}`,
    anotherStatus: `AnotherStatus #${i}`,
  })),
  columns: columnsSearchAndFilters,
  search: {
    searchInput: '',
    setSearchInput: () => {},
    onSearch: () => {},
  },
  topbar: <TopbarComponent />,
  onColumnVisibilityChange: undefined,
};

export const RowSelection = DatagridStory.bind({});

RowSelection.args = {
  columns,
  items: [...Array(pageSize).keys()].map((_, i) => ({
    label: `Item #${i}`,
    price: Math.floor(1 + Math.random() * 100),
  })),
  rowSelection: true,
  enableRowSelection: (row) => row.original.price > 50,
  onRowSelectionChange: () => {},
};

RowSelection.argTypes = {
  rowSelection: {
    description: `this control does not exist on datagrid and simulate the use rowSelection Datagrid prop with the attributes rowSelection and setRowSelection which is a state manage by the parent component.
    When true pass "rowSelection={{rowSelection, setRowSelection}}" as an attribute of the datagrid`,
  },
  enableRowSelection: {
    description: `takes the current row as param and if return true, the selection is enable. If false it is disabled.
    the function should be of type (row: Row<T>) => boolean.
    On this example, the function is (row) => row.orginal.price > 50
    `,
  },
  onRowSelectionChange: {
    description: `callback used by datagrid whenever a change has been made on row selection.
    the function should be of type (rows: Row<T>[]) => void
    `,
  },
};

export const WithSubComponent = DatagridStory.bind({});

WithSubComponent.args = {
  columns,
  items: [...Array(pageSize).keys()].map((_, i) => ({
    label: `Item #${i}`,
    price: Math.floor(1 + Math.random() * 100),
  })),
  getRowCanExpand: () => true,
  renderSubComponent: (row) => (
    <DataGridTextCell>{JSON.stringify(row.original)}</DataGridTextCell>
  ),
};

export const WithDatagridSubComponent = DatagridStory.bind({});

WithDatagridSubComponent.args = {
  columns,
  items: [...Array(pageSize).keys()].map((_, i) => ({
    label: `Item #${i}`,
    price: Math.floor(1 + Math.random() * 100),
  })),
  getRowCanExpand: () => true,
  renderSubComponent: (row, headerRefs) => {
    const subComponentColumns = columns.map((col) => ({
      ...col,
      size: headerRefs.current[col.id].clientWidth,
    }));
    const css = `
      .sub-row > td {
        padding: 0 0 0 var(--expander-column-width) !important;
      }
      .sub-row table, .sub-row tr {
        border: none;
      }
      .sub-row table td {
        border-left: none !important;
        border-right: none !important;
      }
      .sub-row table tr:first-child td {
        border-top: none;
      }
      .sub-row table tr:last-child td {
        border-bottom: none;
      }
      .sub-row table tr td:first-child {
        border-left: none;
      }
      .sub-row table tr td:last-child {
        border-right: none;
      }
    `;

    return (
      <>
        <style>{css}</style>
        <Datagrid
          columns={subComponentColumns}
          items={[
            {
              label: 'sub component label',
              price: 10,
              status: '',
              anotherStatus: '',
              iam: {} as IamObject,
            },
            {
              label: 'sub component label #2',
              price: 100,
              status: '',
              anotherStatus: '',
              iam: {} as IamObject,
            },
          ]}
          totalItems={2}
          hideHeader={true}
          tableLayoutFixed={true}
        ></Datagrid>
      </>
    );
  },
};

export default {
  title: 'Manager UI Kit/Components/Datagrid Cursor',
  component: Datagrid,
  decorators: [withRouter],
};
