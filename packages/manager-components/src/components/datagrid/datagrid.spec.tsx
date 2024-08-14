import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  ColumnSort,
  Datagrid,
  DatagridColumn,
  PaginationState,
} from './datagrid.component';
import DataGridTextCell from './text-cell.component';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

const sampleColumns = [
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
  columns,
  items,
  pageIndex,
  className,
  noResultLabel,
}: {
  columns: DatagridColumn<string>[];
  items: string[];
  pageIndex: number;
  className?: string;
  noResultLabel?: string;
}) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex,
    pageSize: 2,
  });
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
    const handleSortChange = jest.fn();
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
    fireEvent.click(headerA);
    expect(handleSortChange).toHaveBeenCalledWith({ id: 'a', desc: false });
    fireEvent.click(headerA);
    expect(handleSortChange).toHaveBeenCalledWith({ id: 'a', desc: true });
    fireEvent.click(headerA);
    expect(handleSortChange).toHaveBeenCalledWith({ id: 'a', desc: false });
    const headerB = screen.queryByTestId('header-b');
    fireEvent.click(headerB);
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
