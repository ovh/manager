import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import FilteredDatagrid from '@/components/listing/common/datagrid/filtered-datagrid/FilteredDatagrid.component';
import { FilteredDatagridProps } from '@/components/listing/common/datagrid/filtered-datagrid/FilteredDatagrid.props';

// Mock data type
type MockDataItem = {
  id: string;
  name: string;
  value: number;
};

// Mock functions
const mockAddFilter = vi.fn();
const mockRemoveFilter = vi.fn();
const mockApplyFilters = vi.fn((items: unknown[]) => items);

// Mock useColumnFilters hook
vi.mock('@ovh-ux/muk', () => ({
  Datagrid: ({
    topbar,
    columns,
    data,
    isLoading,
    filters,
    search,
    totalCount,
    containerHeight,
    size,
    contentAlignLeft,
    resourceType,
  }: {
    topbar?: React.ReactNode;
    columns: Array<{ id: string }>;
    data?: unknown[];
    isLoading?: boolean;
    filters?: { filters: unknown[]; add: () => void; remove: () => void };
    search?: { searchInput: string; setSearchInput: () => void; onSearch: (val: string) => void };
    totalCount?: number;
    containerHeight?: number;
    size?: string;
    contentAlignLeft?: boolean;
    resourceType?: string;
  }) => (
    <div data-testid="datagrid">
      {topbar && <div data-testid="datagrid-topbar">{topbar}</div>}
      <div data-testid="datagrid-content">
        {isLoading && <div data-testid="loading-indicator">Loading...</div>}
        <div data-testid="datagrid-columns">
          {columns.map((col) => (
            <span key={col.id} data-testid={`column-${col.id}`}>
              {col.id}
            </span>
          ))}
        </div>
        <div data-testid="datagrid-items" data-count={data?.length || 0}>
          {data?.map((item, index) => (
            <div key={index} data-testid={`datagrid-item-${index}`}>
              {JSON.stringify(item)}
            </div>
          ))}
        </div>
        <div data-testid="datagrid-total-count">{totalCount}</div>
        <div data-testid="datagrid-container-height">{containerHeight}</div>
        <div data-testid="datagrid-size">{size}</div>
        <div data-testid="datagrid-content-align-left">{String(contentAlignLeft)}</div>
        <div data-testid="datagrid-resource-type">{resourceType}</div>
        {search && (
          <div data-testid="datagrid-search">
            <input
              data-testid="search-input"
              value={search.searchInput}
              onChange={() => search.setSearchInput()}
            />
            <button
              data-testid="search-button"
              onClick={() => search.onSearch('test-search')}
              type="button"
            >
              Search
            </button>
          </div>
        )}
        {filters && (
          <div data-testid="datagrid-filters">
            <span data-testid="filters-count">{filters.filters.length}</span>
          </div>
        )}
      </div>
    </div>
  ),
  useColumnFilters: () => ({
    filters: [],
    addFilter: mockAddFilter,
    removeFilter: mockRemoveFilter,
  }),
}));

vi.mock('@ovh-ux/manager-core-api', () => ({
  applyFilters: (items: unknown[]) => mockApplyFilters(items),
  FilterComparator: {
    Includes: 'includes',
  },
}));

vi.mock('@ovhcloud/ods-react', () => ({
  TABLE_SIZE: {
    lg: 'lg',
  },
}));

// Mock columns
const mockColumns = [
  { id: 'id', header: 'ID', accessorKey: 'id' },
  { id: 'name', header: 'Name', accessorKey: 'name' },
  { id: 'value', header: 'Value', accessorKey: 'value' },
];

// Mock data
const mockData: MockDataItem[] = [
  { id: '1', name: 'Item 1', value: 100 },
  { id: '2', name: 'Item 2', value: 200 },
  { id: '3', name: 'Item 3', value: 300 },
];

describe('FilteredDatagrid', () => {
  const defaultProps: FilteredDatagridProps<MockDataItem> = {
    data: mockData,
    columns: mockColumns as FilteredDatagridProps<MockDataItem>['columns'],
    searchFilterLabel: 'Search',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockApplyFilters.mockImplementation((items: unknown[]) => items);
  });

  describe('Rendering', () => {
    it.each([
      ['datagrid', 'datagrid'],
      ['search component', 'datagrid-search'],
      ['filters component', 'datagrid-filters'],
    ])('should render %s', (_description, testId) => {
      render(<FilteredDatagrid {...defaultProps} />);

      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });

    it.each([
      ['id', 'column-id'],
      ['name', 'column-name'],
      ['value', 'column-value'],
    ])('should render column %s', (_columnName, testId) => {
      render(<FilteredDatagrid {...defaultProps} />);

      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });

    it.each([
      [0, 'datagrid-item-0'],
      [1, 'datagrid-item-1'],
      [2, 'datagrid-item-2'],
    ])('should render data item %i', (_index, testId) => {
      render(<FilteredDatagrid {...defaultProps} />);

      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });

    it('should render with correct data count', () => {
      render(<FilteredDatagrid {...defaultProps} />);

      expect(screen.getByTestId('datagrid-items')).toHaveAttribute('data-count', '3');
      expect(screen.getByTestId('datagrid-total-count')).toHaveTextContent('3');
    });
  });

  describe('Topbar', () => {
    it('should render topbar when provided', () => {
      const topbar = <div data-testid="custom-topbar">Custom Topbar</div>;
      render(<FilteredDatagrid {...defaultProps} topbar={topbar} />);

      expect(screen.getByTestId('datagrid-topbar')).toBeInTheDocument();
      expect(screen.getByTestId('custom-topbar')).toBeInTheDocument();
    });

    it('should not render topbar when not provided', () => {
      render(<FilteredDatagrid {...defaultProps} />);

      expect(screen.queryByTestId('datagrid-topbar')).not.toBeInTheDocument();
    });

    it('should handle topbar as complex React element', () => {
      const complexTopbar = (
        <div data-testid="complex-topbar">
          <button type="button">Action 1</button>
          <button type="button">Action 2</button>
          <span>Info</span>
        </div>
      );

      render(<FilteredDatagrid {...defaultProps} topbar={complexTopbar} />);

      expect(screen.getByTestId('complex-topbar')).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(3); // 2 in topbar + 1 search button
    });
  });

  describe('Loading State', () => {
    it.each([
      [true, true],
      [false, false],
      [undefined, false],
    ])('when isLoading is %s, loading indicator should be visible: %s', (isLoading, shouldShow) => {
      render(<FilteredDatagrid {...defaultProps} isLoading={isLoading} />);

      if (shouldShow) {
        expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
      } else {
        expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
      }
    });
  });

  describe('Fixed Configuration', () => {
    it.each([
      ['container height', 'datagrid-container-height', '725'],
      ['size', 'datagrid-size', 'lg'],
      ['contentAlignLeft', 'datagrid-content-align-left', 'true'],
    ])('should use fixed %s', (_description, testId, expectedValue) => {
      render(<FilteredDatagrid {...defaultProps} />);

      expect(screen.getByTestId(testId)).toHaveTextContent(expectedValue);
    });
  });

  describe('Resource Type', () => {
    it.each([
      ['TENANT', 'TENANT'],
      ['CUSTOM_RESOURCE', 'CUSTOM_RESOURCE'],
      ['INFRASTRUCTURE', 'INFRASTRUCTURE'],
    ])('should pass resourceType "%s" to Datagrid', (resourceType, expected) => {
      render(<FilteredDatagrid {...defaultProps} resourceType={resourceType} />);

      expect(screen.getByTestId('datagrid-resource-type')).toHaveTextContent(expected);
    });

    it('should handle undefined resourceType', () => {
      render(<FilteredDatagrid {...defaultProps} />);

      expect(screen.getByTestId('datagrid-resource-type')).toBeEmptyDOMElement();
    });
  });

  describe('Search Functionality', () => {
    it.each([
      ['Test Search Label', 'Test Search Label'],
      ['Custom Label', 'Custom Label'],
      ['Another Label', 'Another Label'],
    ])('should call addFilter with searchFilterLabel "%s"', async (label, expectedLabel) => {
      const user = userEvent.setup();
      render(<FilteredDatagrid {...defaultProps} searchFilterLabel={label} />);

      const searchButton = screen.getByTestId('search-button');
      await user.click(searchButton);

      expect(mockAddFilter).toHaveBeenCalledWith({
        key: 'search',
        label: expectedLabel,
        value: 'test-search',
        comparator: 'includes',
      });
    });
  });

  describe('Filter Functionality', () => {
    it('should call applyFilters with data', () => {
      render(<FilteredDatagrid {...defaultProps} />);

      expect(mockApplyFilters).toHaveBeenCalledWith(mockData);
    });

    it.each([
      ['all items', (items: MockDataItem[]) => items, 3],
      ['items with value > 150', (items: MockDataItem[]) => items.filter((i) => i.value > 150), 2],
      ['items with value > 250', (items: MockDataItem[]) => items.filter((i) => i.value > 250), 1],
      ['no items', () => [], 0],
    ])(
      'should display correct count when filtering %s',
      (_description, filterFn, expectedCount) => {
        mockApplyFilters.mockImplementation((items: unknown[]) =>
          filterFn(items as MockDataItem[]),
        );

        render(<FilteredDatagrid {...defaultProps} />);

        expect(screen.getByTestId('datagrid-total-count')).toHaveTextContent(String(expectedCount));
      },
    );
  });

  describe('Empty State', () => {
    it('should handle empty data array', () => {
      render(<FilteredDatagrid {...defaultProps} data={[]} />);

      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
      expect(screen.getByTestId('datagrid-items')).toHaveAttribute('data-count', '0');
      expect(screen.getByTestId('datagrid-total-count')).toHaveTextContent('0');
    });

    it('should handle empty columns array', () => {
      render(
        <FilteredDatagrid
          {...defaultProps}
          columns={[] as FilteredDatagridProps<MockDataItem>['columns']}
        />,
      );

      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
    });
  });

  describe('Data Updates', () => {
    it.each<[string, MockDataItem[], string]>([
      [
        'new data with 2 items',
        [
          { id: '4', name: 'Item 4', value: 400 },
          { id: '5', name: 'Item 5', value: 500 },
        ],
        '2',
      ],
      ['new data with 1 item', [{ id: '6', name: 'Item 6', value: 600 }], '1'],
      ['empty data', [], '0'],
    ])('should update when data changes to %s', (_description, newData, expectedCount) => {
      const { rerender } = render(<FilteredDatagrid {...defaultProps} />);

      expect(screen.getByTestId('datagrid-items')).toHaveAttribute('data-count', '3');

      rerender(<FilteredDatagrid {...defaultProps} data={newData} />);

      expect(screen.getByTestId('datagrid-items')).toHaveAttribute('data-count', expectedCount);
    });
  });

  describe('Integration', () => {
    it('should work with all props provided', () => {
      const topbar = <div data-testid="full-topbar">Full Topbar</div>;

      render(
        <FilteredDatagrid
          {...defaultProps}
          topbar={topbar}
          isLoading={false}
          resourceType="CUSTOM_RESOURCE"
          searchFilterLabel="Full Search"
        />,
      );

      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
      expect(screen.getByTestId('full-topbar')).toBeInTheDocument();
      expect(screen.getByTestId('datagrid-resource-type')).toHaveTextContent('CUSTOM_RESOURCE');
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });

    it.each([
      [0, 'Item 1'],
      [1, 'Item 2'],
      [2, 'Item 3'],
    ])('should maintain data integrity for item %i', (index, expectedContent) => {
      mockApplyFilters.mockImplementation((items: unknown[]) => items);

      render(<FilteredDatagrid {...defaultProps} />);

      expect(screen.getByTestId(`datagrid-item-${index}`)).toHaveTextContent(expectedContent);
    });
  });
});
