import { useState } from 'react';

import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { render } from '@/commons/tests-utils/Render.utils';
import { Datagrid } from '@/components';
import { IamAuthorizationResponse } from '@/hooks/iam/IAM.type';
import { useAuthorizationIam } from '@/hooks/iam/useOvhIam';

import { mockBasicColumns, mockExtendedData, mockIamResponse } from '../../../__mocks__';

vi.mock('@/hooks/iam/useOvhIam');

const mockedHook = useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;

let virtualWindowStart = 0;
let virtualWindowSize = 20;

const setVirtualWindow = (start: number, size = 20) => {
  virtualWindowStart = start;
  virtualWindowSize = size;
};

const scrollToIndexMock = vi.fn();

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
    scrollToIndex: scrollToIndexMock,
  }),
}));

const Wrapper = () => {
  const [items, setItems] = useState(mockExtendedData);
  const [, setIsFetchAllPages] = useState(false);
  const onFetchNextPage = () => {
    setItems([
      ...items,
      {
        id: `person-${items.length + 1}`,
        name: `Person ${items.length + 1}`,
        age: items.length + 1,
      },
    ]);
  };
  const onFetchAllPages = () => {
    const newData = Array.from({ length: 200 }, (_, index) => ({
      id: `person-${index}`,
      name: `Person ${index}`,
      age: index + 1,
    }));
    setItems(newData);
    setIsFetchAllPages(true);
  };

  return (
    <Datagrid
      columns={mockBasicColumns}
      data={items}
      containerHeight={300}
      onFetchNextPage={onFetchNextPage}
      onFetchAllPages={onFetchAllPages}
      hasNextPage={true}
    />
  );
};

describe('TableBodyComponent', () => {
  beforeEach(() => {
    mockedHook.mockReturnValue(mockIamResponse);
  });
  it('should render the table body', () => {
    render(<Datagrid columns={mockBasicColumns} data={mockExtendedData} containerHeight={300} />);
    expect(screen.getByText('Person 1')).toBeInTheDocument();
    expect(screen.getByText('Person 2')).toBeInTheDocument();
    expect(screen.getByText('Person 3')).toBeInTheDocument();
    expect(screen.getByText('Person 4')).toBeInTheDocument();
    expect(screen.getByText('Person 5')).toBeInTheDocument();
  });

  it('should render the table body, Charger plus and display next items', () => {
    render(<Wrapper />);
    expect(screen.getByText('Person 1')).toBeInTheDocument();
    expect(screen.getByText('Person 2')).toBeInTheDocument();
    expect(screen.getByText('Charger plus')).toBeInTheDocument();
    const loadMoreButton = screen.getByText('Charger plus');
    fireEvent.click(loadMoreButton);
    expect(screen.getByText('Person 6')).toBeInTheDocument();
    fireEvent.click(loadMoreButton);
    fireEvent.click(loadMoreButton);
    expect(screen.getByText('Person 7')).toBeInTheDocument();
    expect(screen.getByText('Person 8')).toBeInTheDocument();
  });

  it('should test virtualization with scrollable window', () => {
    // Start with first 20 items visible
    setVirtualWindow(0, 20);
    const { container } = render(<Wrapper />);

    // Charger tout data (200 items)
    const loadAllButton = screen.getByText('Charger tout');
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
