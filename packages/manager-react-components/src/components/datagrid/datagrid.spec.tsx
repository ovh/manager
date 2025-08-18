import { vitest } from 'vitest';
import React, { useState } from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { FilterCategories } from '@ovh-ux/manager-core-api';
import { Row } from '@tanstack/react-table';
import {
  ColumnSort,
  Datagrid,
  PaginationState,
  FilterProps,
} from './datagrid.component';
import DataGridTextCell from './text-cell.component';
import { defaultNumberOfLoadingRows } from './datagrid.constants';

vitest.mock('react-i18next', async () => {
  const originalModule = await vitest.importActual('react-i18next');

  return {
    ...originalModule,
    useTranslation: () => {
      return {
        t: (str: string) => str,
        i18n: {
          changeLanguage: () => new Promise(() => {}),
        },
      };
    },
  };
});

const sampleColumns = [
  {
    id: 'name',
    cell: (name: string) => {
      return <span>{name}</span>;
    },
    label: 'Name',
    comparator: FilterCategories.String,
    isFilterable: true,
  },
  {
    id: 'another-column',
    label: 'test',
    cell: () => <DataGridTextCell />,
    comparator: FilterCategories.String,
    isFilterable: true,
  },
];

const cols = [
  {
    id: 'name',
    cell: (name: string) => {
      return <span>{name}</span>;
    },
    label: 'Name',
  },
  {
    id: 'another-column',
    label: 'test',
    cell: () => <DataGridTextCell />,
  },
];

const DatagridTest = ({
  columns = cols,
  items,
  pageIndex,
  pageSize,
  className,
  noResultLabel,
  filters,
  getRowCanExpand,
  renderSubComponent,
  tableLayoutFixed,
  hasRowSelection,
  enableRowSelection,
  onRowSelectionChange,
  getRowId,
}: {
  columns: any;
  items: string[];
  pageIndex: number;
  pageSize?: number;
  className?: string;
  noResultLabel?: string;
  filters?: FilterProps;
  getRowCanExpand?: (props: Row<any>) => boolean;
  renderSubComponent?: (row: Row<any>) => JSX.Element;
  tableLayoutFixed?: boolean;
  hasRowSelection?: boolean;
  enableRowSelection?: (row: Row<any>) => boolean;
  onRowSelectionChange?: (selectedRows: Row<any>[]) => void;
  getRowId?: (originalRow: any, index: number) => string;
}) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex,
    pageSize: pageSize || 2,
  });

  const [rowSelection, setRowSelection] = useState({});
  const start = pagination.pageIndex * pagination.pageSize;
  const end = start + pagination.pageSize;
  return (
    <Datagrid
      columns={columns}
      items={items.slice(start, end)}
      totalItems={items.length}
      pagination={pagination}
      sorting={{ id: 'name', desc: false }}
      onPaginationChange={setPagination}
      onSortChange={() => {}}
      className={className || ''}
      noResultLabel={noResultLabel}
      filters={filters}
      getRowCanExpand={getRowCanExpand}
      renderSubComponent={renderSubComponent}
      tableLayoutFixed={tableLayoutFixed}
      rowSelection={
        hasRowSelection
          ? {
              rowSelection,
              setRowSelection,
              enableRowSelection,
              onRowSelectionChange: onRowSelectionChange as any,
            }
          : undefined
      }
      getRowId={getRowId}
    />
  );
};

describe('Paginated datagrid component', () => {
  it('should display the correct number of columns', async () => {
    const { container } = render(
      <DatagridTest
        columns={[
          {
            id: 'a',
            cell: () => <>'a'</>,
            label: 'a',
          },
          {
            id: 'b',
            cell: () => <>'b'</>,
            label: 'b',
          },
          {
            id: 'c',
            cell: () => <>'c'</>,
            label: 'c',
          },
        ]}
        items={[]}
        pageIndex={0}
      />,
    );
    expect(container.querySelectorAll('thead th').length).toBe(3);
  });

  it('should call sort function when clicking columns header', async () => {
    const handleSortChange = vitest.fn();
    const SortTest = () => {
      const [sorting, setSorting] = useState({ id: 'a', desc: true });
      return (
        <Datagrid
          columns={[
            {
              id: 'a',
              cell: () => <>'a'</>,
              label: 'a',
            },
            {
              id: 'b',
              cell: () => <>'b'</>,
              label: 'b',
            },
          ]}
          items={[]}
          totalItems={0}
          pagination={{ pageIndex: 0, pageSize: 1 }}
          sorting={sorting}
          manualSorting={true}
          onPaginationChange={() => {}}
          onSortChange={(c: ColumnSort) => {
            setSorting(c);
            handleSortChange(c);
          }}
        />
      );
    };
    render(<SortTest />);
    const headerA = screen.queryByTestId('header-a');
    expect(headerA).not.toBeNull();
    expect(handleSortChange).not.toHaveBeenCalled();
    fireEvent.click(headerA!);
    expect(handleSortChange).toHaveBeenCalledWith({ id: 'a', desc: false });
    fireEvent.click(headerA!);
    expect(handleSortChange).toHaveBeenCalledWith({ id: 'a', desc: true });
    fireEvent.click(headerA!);
    expect(handleSortChange).toHaveBeenCalledWith({ id: 'a', desc: false });
    const headerB = screen.queryByTestId('header-b');
    fireEvent.click(headerB!);
    expect(handleSortChange).toHaveBeenCalledWith({ id: 'b', desc: false });
  });

  it('should display first page of items', async () => {
    const { container } = render(
      <DatagridTest
        columns={sampleColumns}
        items={['foo', 'bar', 'hello']}
        pageIndex={0}
      />,
    );
    expect(screen.queryByText('foo')).not.toBeNull();
    expect(screen.queryByText('bar')).not.toBeNull();
    expect(screen.queryByText('hello')).toBeNull();
    expect(container.querySelectorAll('thead tr').length).toBe(1);
    expect(container.querySelectorAll('tbody tr').length).toBe(2);
  });

  it('should display second page of items', async () => {
    const { container } = render(
      <DatagridTest
        columns={sampleColumns}
        items={['foo', 'bar', 'hello']}
        pageIndex={1}
      />,
    );
    expect(screen.queryByText('foo')).toBeNull();
    expect(screen.queryByText('bar')).toBeNull();
    expect(screen.queryByText('hello')).not.toBeNull();
    expect(container.querySelectorAll('thead tr').length).toBe(1);
    expect(container.querySelectorAll('tbody tr').length).toBe(1);
  });

  it('should display a message if there are no items', async () => {
    const { container } = render(
      <DatagridTest columns={sampleColumns} items={[]} pageIndex={0} />,
    );
    expect(screen.queryByText('common_pagination_no_results')).not.toBeNull();
    expect(container.querySelectorAll('thead tr').length).toBe(1);
    expect(container.querySelectorAll('tbody tr').length).toBe(1);
  });

  it('should display a custom message if there are no items and we pass a custom message', async () => {
    render(
      <DatagridTest
        columns={sampleColumns}
        items={[]}
        pageIndex={0}
        noResultLabel="Test no result"
      />,
    );
    expect(screen.queryByText('Test no result')).not.toBeNull();
  });
});

it('should disable overflow of table', async () => {
  const { container } = render(
    <DatagridTest
      columns={sampleColumns}
      items={[]}
      pageIndex={0}
      className={'overflow-hidden'}
    />,
  );
  expect(container.querySelectorAll('.overflow-hidden').length).toBe(1);
});

it('should have the default number of loading row when isLoading is true and numberOfLoadingRows is not specified', async () => {
  const { queryAllByTestId } = render(
    <Datagrid columns={cols} items={[]} totalItems={0} isLoading />,
  );
  expect(queryAllByTestId('loading-row').length).toBe(
    defaultNumberOfLoadingRows,
  );
});

it('should display the specified number of loading rows when isLoading is true', async () => {
  const numberOfLoadingRows = 2;
  const { queryAllByTestId } = render(
    <Datagrid
      columns={cols}
      items={[]}
      totalItems={0}
      numberOfLoadingRows={numberOfLoadingRows}
      isLoading
    />,
  );
  expect(queryAllByTestId('loading-row').length).toBe(numberOfLoadingRows);
});

it('should display take the pageSize and not the default one as numberOfLoadingRows when specified', async () => {
  const pageSize = 10;
  const { queryAllByTestId } = render(
    <Datagrid
      columns={cols}
      items={[]}
      totalItems={0}
      pagination={{ pageIndex: 0, pageSize }}
      isLoading
    />,
  );
  expect(queryAllByTestId('loading-row').length).toBe(pageSize);
});

it('should set isLoading to load more button when isLoading is true', async () => {
  const { getByTestId } = render(
    <Datagrid columns={cols} items={[]} totalItems={0} isLoading hasNextPage />,
  );
  expect(getByTestId('load-more-btn')).toHaveAttribute('is-loading', 'true');
});

it('should display load all button and set isLoading to true', async () => {
  const { getByTestId } = render(
    <Datagrid
      columns={cols}
      items={[]}
      totalItems={0}
      isLoading
      hasNextPage
      onFetchAllPages={() => {}}
    />,
  );
  expect(getByTestId('load-all-btn')).toHaveAttribute('is-loading', 'true');
});

it('should disable overflow of table', async () => {
  const { container } = render(
    <DatagridTest
      columns={sampleColumns}
      items={[]}
      pageIndex={0}
      className={'overflow-hidden'}
    />,
  );
  expect(container.querySelectorAll('.overflow-hidden').length).toBe(1);
});

it('should display filter add and filter list', async () => {
  const filters = {
    filters: [
      {
        key: 'customName',
        comparator: 'includes',
        value: 'coucou',
        label: 'customName',
      },
    ],
    add: () => {},
    remove: () => {},
  } as FilterProps;
  const { container } = render(
    <DatagridTest
      columns={sampleColumns}
      items={[]}
      pageIndex={0}
      className={'overflow-hidden'}
      filters={filters}
    />,
  );
  expect(
    container.querySelectorAll('#datagrid-filter-popover-trigger').length,
  ).toBe(1);
  expect(container.querySelectorAll('#datagrid-filter-list').length).toBe(1);
});

it('should display new column to expand a row sub component', async () => {
  const { container } = render(
    <DatagridTest
      columns={sampleColumns}
      items={['foo', 'bar', 'hello']}
      pageIndex={0}
      className={'overflow-hidden'}
      getRowCanExpand={() => true}
      renderSubComponent={(row) => (
        <span id={`sub-${row.original}`}>{`sub-${row.original}`}</span>
      )}
    />,
  );

  expect(
    container.querySelectorAll('ods-button[icon=chevron-right]').length,
  ).toBe(2);

  const button = container.querySelectorAll(
    'ods-button[icon=chevron-right]',
  )[0];
  await act(() => fireEvent.click(button!));
  expect(
    container.querySelectorAll('ods-button[icon=chevron-down]').length,
  ).toBe(1);

  expect(container.querySelector('#sub-foo')).toBeDefined();
});

it('should use fixed column width', async () => {
  const sizedColumns = sampleColumns.map((column) => ({ ...column, size: 50 }));
  const { getByText } = render(
    <DatagridTest
      columns={sizedColumns}
      items={['foo', 'bar', 'hello']}
      pageIndex={0}
      className={'overflow-hidden'}
      tableLayoutFixed={true}
    />,
  );

  const td = getByText('foo').closest('td');
  expect(td?.style.width).toBe('50px');
});

it('should display new column to select rows', async () => {
  const selectAllMock = vitest.fn();
  const { container } = render(
    <DatagridTest
      columns={sampleColumns}
      items={['foo', 'bar', 'hello']}
      pageIndex={0}
      pageSize={3}
      className={'overflow-hidden'}
      hasRowSelection={true}
      enableRowSelection={(row) => row.original === 'foo'}
      onRowSelectionChange={selectAllMock}
      getRowId={(row) => row}
    />,
  );

  const allCheckboxes = container.querySelectorAll('ods-checkbox');

  expect(allCheckboxes.length).toBe(4); // 3 row and 1 header

  expect(allCheckboxes[2]).toHaveAttribute('is-disabled', 'true');

  expect(allCheckboxes[1]).toHaveAttribute('is-disabled', 'false');

  const toogleAll = allCheckboxes[0];

  fireEvent.click(toogleAll!);

  waitFor(() => {
    expect(selectAllMock).toHaveBeenCalledWith(['foo']);
  });
});
