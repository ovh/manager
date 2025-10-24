import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render } from '@/setupTest';

import { useAuthorizationIam } from '../../../hooks/iam';
import { IamAuthorizationResponse } from '../../../hooks/iam/iam.interface';
import { Datagrid } from '../Datagrid.component';
import {
  mockBasicColumns,
  mockColumnVisibility,
  mockColumns,
  mockData,
  mockFilters,
  mockIamResponse,
  mockOnFetchAllPages,
  mockOnFetchNextPage,
  mockOnSortChange,
  mockRenderSubComponent,
  mockRowSelection,
  mockSearch,
  mockSetColumnVisibility,
} from '../__mocks__';

vi.mock('../../../hooks/iam');

const mockedHook = useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;

const virtualWindowStart = 0;
const virtualWindowSize = 20;

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

describe('Datagrid', () => {
  beforeEach(() => {
    mockedHook.mockReturnValue(mockIamResponse);
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render with data and headers', () => {
      render(<Datagrid columns={mockBasicColumns} data={mockData} />);

      expect(screen.getByText('name')).toBeInTheDocument();
      expect(screen.getByText('age')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
    });

    it('should render with empty data', () => {
      render(<Datagrid columns={mockBasicColumns} data={[]} />);

      expect(screen.getByText('name')).toBeInTheDocument();
      expect(screen.getByText('Aucun résultat')).toBeInTheDocument();
    });

    it('should apply container height styles', () => {
      const { container } = render(
        <Datagrid columns={mockBasicColumns} data={mockData} containerHeight={400} />,
      );
      const tableContainer = container.querySelector('.overflow-auto.relative.w-full');
      expect(tableContainer).toHaveStyle('height: 400px');
    });
  });

  describe('Topbar Features', () => {
    it('should render custom topbar', () => {
      const customTopbar = <div data-testid="custom-topbar">Custom Topbar</div>;
      render(<Datagrid columns={mockBasicColumns} data={mockData} topbar={customTopbar} />);

      expect(screen.getByTestId('custom-topbar')).toBeInTheDocument();
    });

    it('should render search when enabled', () => {
      render(<Datagrid columns={mockColumns} data={mockData} search={mockSearch} />);

      expect(screen.getByTestId('topbar-container')).toBeInTheDocument();
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('should render filters when enabled', () => {
      render(<Datagrid columns={mockColumns} data={mockData} filters={mockFilters} />);

      expect(screen.getByTestId('topbar-container')).toBeInTheDocument();
      expect(screen.getByTestId('datagrid-topbar-filters')).toBeInTheDocument();
    });

    it('should render column visibility when enabled', () => {
      render(
        <Datagrid
          columns={mockColumns}
          data={mockData}
          columnVisibility={{
            columnVisibility: mockColumnVisibility,
            setColumnVisibility: mockSetColumnVisibility,
          }}
        />,
      );

      expect(screen.getByTestId('topbar-container')).toBeInTheDocument();
      expect(screen.getByText('Colonnes')).toBeInTheDocument();
    });

    it('should not render topbar when no features enabled', () => {
      render(<Datagrid columns={mockBasicColumns} data={mockData} />);

      expect(screen.queryByTestId('topbar-container')).not.toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('should handle sorting with setSorting', () => {
      render(
        <Datagrid
          columns={mockBasicColumns}
          data={mockData}
          sorting={{
            sorting: [{ id: 'name', desc: false }],
            setSorting: mockOnSortChange,
            manualSorting: false,
          }}
        />,
      );
      const NameHeaderButton = screen.getByText('name');
      expect(NameHeaderButton).toBeInTheDocument();
      fireEvent.click(NameHeaderButton);
      expect(mockOnSortChange).toHaveBeenCalledWith([{ id: 'name', desc: true }]);
    });

    it('should handle manual sorting', () => {
      render(
        <Datagrid
          columns={mockBasicColumns}
          data={mockData}
          sorting={{
            sorting: [{ id: 'name', desc: false }],
            setSorting: mockOnSortChange,
            manualSorting: true,
          }}
        />,
      );
      const NameHeaderButton = screen.getByText('name');
      expect(NameHeaderButton).toBeInTheDocument();
      fireEvent.click(NameHeaderButton);
    });
  });

  describe('Search & Filter Interactions', () => {
    it('should handle search input changes', () => {
      render(<Datagrid columns={mockColumns} data={mockData} search={mockSearch} />);
      const searchInput = screen.getByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: 'new search' } });
      expect(mockSearch.setSearchInput).toHaveBeenCalledWith('new search');
    });

    it('should handle search form submission', () => {
      render(<Datagrid columns={mockColumns} data={mockData} search={mockSearch} />);

      const form = screen.getByRole('searchbox').closest('form');
      fireEvent.submit(form);

      expect(mockSearch.onSearch).toHaveBeenCalledWith('test');
    });

    it('should render filter list when filters are active', () => {
      const filtersWithData = {
        ...mockFilters,
        filters: [
          {
            key: 'name',
            label: 'name',
            value: 'John',
            comparator: 'contains' as any,
          },
        ],
      };

      render(<Datagrid columns={mockColumns} data={mockData} filters={filtersWithData} />);
      expect(screen.getByTestId('datagrid-filter-list')).toBeInTheDocument();
    });
  });

  describe('Pagination & Actions', () => {
    it('should render pagination buttons when hasNextPage is true', () => {
      render(
        <Datagrid
          columns={mockBasicColumns}
          data={mockData}
          hasNextPage={true}
          onFetchNextPage={mockOnFetchNextPage}
          onFetchAllPages={mockOnFetchAllPages}
        />,
      );

      expect(screen.getByText('Charger plus')).toBeInTheDocument();
      expect(screen.getByText('Charger tout')).toBeInTheDocument();
    });

    it('should call pagination handlers when buttons are clicked', () => {
      render(
        <Datagrid
          columns={mockBasicColumns}
          data={mockData}
          hasNextPage={true}
          onFetchNextPage={mockOnFetchNextPage}
          onFetchAllPages={mockOnFetchAllPages}
        />,
      );

      fireEvent.click(screen.getByText('Charger plus'));
      fireEvent.click(screen.getByText('Charger tout'));

      expect(mockOnFetchNextPage).toHaveBeenCalledTimes(1);
      expect(mockOnFetchAllPages).toHaveBeenCalledTimes(1);
    });

    it('should disable pagination buttons when loading', () => {
      render(
        <Datagrid
          columns={mockBasicColumns}
          data={mockData}
          hasNextPage={true}
          onFetchNextPage={mockOnFetchNextPage}
          onFetchAllPages={mockOnFetchAllPages}
          isLoading={true}
        />,
      );
      expect(screen.getByText('Charger plus')).toBeDisabled();
      expect(screen.getByText('Charger tout')).toBeDisabled();
    });
  });

  describe('Footer & Results', () => {
    it('should render footer with items count and total count', () => {
      render(<Datagrid columns={mockBasicColumns} data={mockData} totalCount={100} />);
      expect(screen.getByText('2 sur 100 résultats')).toBeInTheDocument();
    });

    it('should render footer with only items count when totalCount is provided', () => {
      render(<Datagrid columns={mockBasicColumns} data={mockData} totalCount={100} />);

      expect(screen.getByText('2 sur 100 résultats')).toBeInTheDocument();
    });

    it('should render footer with zero items count', () => {
      render(<Datagrid columns={mockBasicColumns} data={[]} totalCount={100} />);
      expect(screen.getByText('0 sur 100 résultats')).toBeInTheDocument();
    });
  });

  describe('Advanced Features', () => {
    it('should handle row selection', () => {
      const { container } = render(
        <Datagrid columns={mockBasicColumns} data={mockData} rowSelection={mockRowSelection} />,
      );
      const targetDiv = container.querySelector('thead tr th label');
      expect(targetDiv).toBeInTheDocument();
      expect(targetDiv).toHaveAttribute('id', 'checkbox:select-all');
      const targetDivBody = container.querySelector('tbody tr td label');
      expect(targetDivBody).toBeInTheDocument();
      expect(targetDivBody).toHaveAttribute('id', 'checkbox:0');
    });

    it('should handle expandable rows', () => {
      const { container } = render(
        <Datagrid
          columns={mockBasicColumns}
          data={mockData}
          expandable={{
            expanded: {},
            setExpanded: vi.fn() as any,
          }}
          renderSubComponent={mockRenderSubComponent}
        />,
      );
      const targetDiv = container.querySelector('tbody tr td div button span');
      expect(targetDiv).toBeInTheDocument();
      expect(targetDiv?.className).toContain('chevron-right');
    });

    it('should handle loading state', () => {
      const { container } = render(
        <Datagrid columns={mockBasicColumns} data={[]} isLoading={true} />,
      );
      // expect td that contains skeleton in the class
      const targetDiv = container.querySelector('tbody tr td div div');
      expect(targetDiv).toBeInTheDocument();
      expect(targetDiv?.className).toContain('skeleton');
    });

    it('should handle content alignment left', () => {
      render(<Datagrid columns={mockBasicColumns} data={mockData} contentAlignLeft={true} />);
      expect(screen.getByText('name')).toHaveClass('pl-4');
    });

    it('should handle content alignment center', () => {
      render(<Datagrid columns={mockBasicColumns} data={mockData} contentAlignLeft={false} />);
      expect(screen.getByText('name')).toHaveClass('text-center');
    });
  });

  describe('All Features Combined', () => {
    it('should render with all features enabled', () => {
      const customTopbar = <div data-testid="custom-topbar">Custom Topbar</div>;

      render(
        <Datagrid
          columns={mockColumns}
          data={mockData}
          topbar={customTopbar}
          search={mockSearch}
          filters={mockFilters}
          columnVisibility={{
            columnVisibility: mockColumnVisibility,
            setColumnVisibility: mockSetColumnVisibility,
          }}
          sorting={{
            sorting: [{ id: 'name', desc: false }],
            setSorting: mockOnSortChange,
            manualSorting: false,
          }}
          rowSelection={mockRowSelection}
          expandable={{
            expanded: {},
            setExpanded: vi.fn() as any,
          }}
          renderSubComponent={mockRenderSubComponent}
          hasNextPage={true}
          onFetchNextPage={mockOnFetchNextPage}
          onFetchAllPages={mockOnFetchAllPages}
          totalCount={100}
          containerHeight={500}
          resourceType="users"
        />,
      );

      // Check all features are rendered
      expect(screen.getByTestId('custom-topbar')).toBeInTheDocument();
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
      expect(screen.getByTestId('datagrid-topbar-filters')).toBeInTheDocument();
      expect(screen.getByText('Colonnes')).toBeInTheDocument();
      expect(screen.getByText('Charger plus')).toBeInTheDocument();
      expect(screen.getByText('Charger tout')).toBeInTheDocument();
      expect(screen.getByText('2 sur 100 résultats')).toBeInTheDocument();
    });
  });
});
