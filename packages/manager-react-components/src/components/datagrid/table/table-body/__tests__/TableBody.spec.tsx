import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../../../../utils/test.provider';
import { Datagrid } from '../../../Datagrid.component';
import { useAuthorizationIam } from '../../../../../hooks/iam';
import { IamAuthorizationResponse } from '../../../../../hooks/iam/iam.interface';

vi.mock('../../../../../hooks/iam');

const mockedHook =
  useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;

const columns = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
  },
  {
    id: 'age',
    header: 'Age',
    accessorKey: 'age',
  },
];

const data = [
  {
    name: 'Person 1',
    age: 25,
  },
  {
    name: 'Person 2',
    age: 26,
  },
  {
    name: 'Person 3',
    age: 25,
  },
  {
    name: 'Person 4',
    age: 27,
  },
  {
    name: 'Person 5',
    age: 28,
  },
];

let virtualWindowStart = 0;
let virtualWindowSize = 20;

const setVirtualWindow = (start: number, size: number = 20) => {
  virtualWindowStart = start;
  virtualWindowSize = size;
};

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: ({ count }: { count: number }) => ({
    getTotalSize: () => count * 50,
    getVirtualItems: () => {
      const endIndex = Math.min(virtualWindowStart + virtualWindowSize, count);
      const actualStart = Math.max(0, virtualWindowStart);
      const actualCount = Math.max(0, endIndex - actualStart);

      return Array.from({ length: actualCount }).map((_, i) => {
        const index = actualStart + i;
        return {
          index,
          key: index,
          start: index * 50,
          size: 50,
        };
      });
    },
    measureElement: () => {},
    overscan: 40,
  }),
}));

const Wrapper = () => {
  const [items, setItems] = useState(data);
  const [isFetchAllPages, setIsFetchAllPages] = useState(false);
  const onFetchNextPage = () => {
    setItems([
      ...items,
      {
        name: `Person ${items.length + 1}`,
        age: items.length + 1,
      },
    ]);
  };
  const onFetchAllPages = () => {
    const newData = Array.from({ length: 200 }, (_, index) => ({
      name: `Person ${index}`,
      age: index + 1,
    }));
    setItems(newData);
    setIsFetchAllPages(true);
  };
  return (
    <Datagrid
      columns={columns}
      data={items}
      containerHeight="300px"
      onFetchNextPage={onFetchNextPage}
      onFetchAllPages={onFetchAllPages}
      hasNextPage={isFetchAllPages ? false : true}
    />
  );
};

describe('TableBodyComponent', () => {
  it('should render the table body', () => {
    render(<Datagrid columns={columns} data={data} containerHeight="300px" />);
    expect(screen.getByText('Person 1')).toBeInTheDocument();
    expect(screen.getByText('Person 2')).toBeInTheDocument();
    expect(screen.getByText('Person 3')).toBeInTheDocument();
    expect(screen.getByText('Person 4')).toBeInTheDocument();
    expect(screen.getByText('Person 5')).toBeInTheDocument();
  });

  it('should render the table body, load more and display next items', () => {
    mockedHook.mockReturnValue({
      isAuthorized: true,
      isLoading: false,
      isFetched: true,
    });
    render(<Wrapper />);
    expect(screen.getByText('Person 1')).toBeInTheDocument();
    expect(screen.getByText('Person 2')).toBeInTheDocument();
    expect(screen.getByText('Load more')).toBeInTheDocument();
    const loadMoreButton = screen.getByText('Load more');
    fireEvent.click(loadMoreButton);
    expect(screen.getByText('Person 6')).toBeInTheDocument();
    fireEvent.click(loadMoreButton);
    fireEvent.click(loadMoreButton);
    expect(screen.getByText('Person 7')).toBeInTheDocument();
    expect(screen.getByText('Person 8')).toBeInTheDocument();
  });

  it('should test virtualization with scrollable window', () => {
    mockedHook.mockReturnValue({
      isAuthorized: true,
      isLoading: false,
      isFetched: true,
    });

    // Start with first 20 items visible
    setVirtualWindow(0, 20);
    const { container } = render(<Wrapper />);

    // Load all data (200 items)
    const loadAllButton = screen.getByText('Load all');
    fireEvent.click(loadAllButton);

    // Should see first 20 items (Person 0-19)
    expect(screen.getByText('Person 0')).toBeInTheDocument();
    expect(screen.getByText('Person 19')).toBeInTheDocument();
    // Should NOT see items beyond the virtual window
    expect(screen.queryByText('Person 20')).not.toBeInTheDocument();
    expect(screen.queryByText('Person 199')).not.toBeInTheDocument();

    // Verify only 20 rows are rendered
    expect(container.querySelectorAll('tr').length).toBe(21);
  });
});
