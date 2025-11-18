import { fireEvent, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { TABLE_SIZE, TABLE_VARIANT } from '@ovhcloud/ods-react';

import { FilterComparator } from '@ovh-ux/manager-core-api';

import { assertNotNull } from '@/commons/tests-utils/Assertions.utils';
import { renderDataGrid } from '@/commons/tests-utils/Render.utils';
import { IamAuthorizationResponse } from '@/hooks/iam/IAM.type';
import { useAuthorizationIam } from '@/hooks/iam/useOvhIam';

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

vi.mock('@/hooks/iam/useOvhIam');
const mockedHook = useAuthorizationIam as unknown as Mock<() => IamAuthorizationResponse>;

const virtualWindowStart = 0;
const virtualWindowSize = 20;
const scrollToIndexMock = vi.fn<(index: number) => void>();

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: ({ count }: { count: number }) => {
    const getTotalSize = () => count * 50;
    const getVirtualItems = () => {
      const endIndex = Math.min(virtualWindowStart + virtualWindowSize, count);
      const actualStart = Math.max(0, virtualWindowStart);
      const actualCount = Math.max(0, endIndex - actualStart);
      return Array.from({ length: actualCount }, (_, i) => {
        const index = actualStart + i;
        return { index, key: index, start: index * 50, size: 50 };
      });
    };
    return {
      getTotalSize,
      getVirtualItems,
      measureElement: vi.fn(),
      overscan: 40,
      scrollToIndex: scrollToIndexMock,
    };
  },
}));

describe('Datagrid', () => {
  beforeEach(() => {
    mockedHook.mockReturnValue(mockIamResponse);
    vi.clearAllMocks();
  });

  /* ---------------------------- Basic Rendering ---------------------------- */
  describe('Basic Rendering', () => {
    it('should render with data and headers', () => {
      renderDataGrid({ columns: mockBasicColumns, data: mockData });
      expect(screen.getByText('name')).toBeInTheDocument();
      expect(screen.getByText('age')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
    });

    it('should render with empty data', () => {
      renderDataGrid({ columns: mockBasicColumns, data: [] });
      expect(screen.getByText('name')).toBeInTheDocument();
      expect(screen.getByText('Aucun résultat')).toBeInTheDocument();
    });

    it('should apply container height styles', () => {
      const { container } = renderDataGrid({
        columns: mockBasicColumns,
        data: mockData,
        containerHeight: 400,
      });
      const tableContainer = container.querySelector('.overflow-auto.relative.w-full');
      expect(tableContainer).toHaveStyle('height: 400px');
    });
  });

  /* ---------------------------- Topbar Features ---------------------------- */
  describe('Topbar Features', () => {
    it('should render custom topbar', () => {
      const customTopbar = <div data-testid="custom-topbar">Custom Topbar</div>;
      renderDataGrid({
        columns: mockBasicColumns,
        data: mockData,
        topbar: customTopbar,
      });
      expect(screen.getByTestId('custom-topbar')).toBeInTheDocument();
    });

    it('should render search when enabled', () => {
      renderDataGrid({ columns: mockColumns, data: mockData, search: mockSearch });
      expect(screen.getByTestId('topbar-container')).toBeInTheDocument();
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('should render filters when enabled', () => {
      renderDataGrid({ columns: mockColumns, data: mockData, filters: mockFilters });
      expect(screen.getByTestId('topbar-container')).toBeInTheDocument();
      expect(screen.getByTestId('datagrid-topbar-filters')).toBeInTheDocument();
    });

    it('should render column visibility when enabled', () => {
      renderDataGrid({
        columns: mockColumns,
        data: mockData,
        columnVisibility: {
          columnVisibility: mockColumnVisibility,
          setColumnVisibility: mockSetColumnVisibility,
        },
      });
      expect(screen.getByTestId('topbar-container')).toBeInTheDocument();
      expect(screen.getByText('Colonnes')).toBeInTheDocument();
    });

    it('should not render topbar when no features enabled', () => {
      renderDataGrid({ columns: mockBasicColumns, data: mockData });
      expect(screen.queryByTestId('topbar-container')).not.toBeInTheDocument();
    });
  });

  /* ------------------------------- Sorting -------------------------------- */
  describe('Sorting', () => {
    it('should handle sorting with setSorting', () => {
      renderDataGrid({
        columns: mockBasicColumns,
        data: mockData,
        sorting: {
          sorting: [{ id: 'name', desc: false }],
          setSorting: mockOnSortChange,
          manualSorting: false,
        },
      });
      const header = screen.getByText('name');
      fireEvent.click(header);
      expect(mockOnSortChange).toHaveBeenCalledWith([{ id: 'name', desc: true }]);
    });

    it('should handle manual sorting', () => {
      renderDataGrid({
        columns: mockBasicColumns,
        data: mockData,
        sorting: {
          sorting: [{ id: 'name', desc: false }],
          setSorting: mockOnSortChange,
          manualSorting: true,
        },
      });
      const NameHeaderButton = screen.getByText('name');
      expect(NameHeaderButton).toBeInTheDocument();
      fireEvent.click(NameHeaderButton);
    });
  });

  /* ----------------------- Search & Filter Interactions -------------------- */
  describe('Search & Filter Interactions', () => {
    it('should handle search input changes', () => {
      renderDataGrid({ columns: mockColumns, data: mockData, search: mockSearch });
      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'new search' } });
      expect(mockSearch.setSearchInput).toHaveBeenCalledWith('new search');
    });

    it('should handle search form submission', () => {
      renderDataGrid({ columns: mockColumns, data: mockData, search: mockSearch });

      const form = screen.getByRole('searchbox').closest('form');
      assertNotNull(form);

      fireEvent.submit(form);
      expect(mockSearch.onSearch).toHaveBeenCalledWith('test');
    });

    it('should render filter list when filters are active', () => {
      const filtersWithData = {
        ...mockFilters,
        filters: [
          { key: 'name', label: 'name', value: 'John', comparator: FilterComparator.Includes },
        ],
      };
      renderDataGrid({ columns: mockColumns, data: mockData, filters: filtersWithData });
      expect(screen.getByTestId('datagrid-filter-list')).toBeInTheDocument();
    });
  });

  /* --------------------------- Pagination & Actions ------------------------ */
  describe('Pagination & Actions', () => {
    it('should render pagination buttons when hasNextPage is true', () => {
      renderDataGrid({
        columns: mockBasicColumns,
        data: mockData,
        hasNextPage: true,
        onFetchNextPage: mockOnFetchNextPage,
        onFetchAllPages: mockOnFetchAllPages,
      });
      expect(screen.getByText('Charger plus')).toBeInTheDocument();
      expect(screen.getByText('Charger tout')).toBeInTheDocument();
    });

    it('should call pagination handlers when buttons are clicked', () => {
      renderDataGrid({
        columns: mockBasicColumns,
        data: mockData,
        hasNextPage: true,
        onFetchNextPage: mockOnFetchNextPage,
        onFetchAllPages: mockOnFetchAllPages,
      });
      fireEvent.click(screen.getByText('Charger plus'));
      fireEvent.click(screen.getByText('Charger tout'));
      expect(mockOnFetchNextPage).toHaveBeenCalledTimes(1);
      expect(mockOnFetchAllPages).toHaveBeenCalledTimes(1);
    });

    it('should disable pagination buttons when loading', () => {
      renderDataGrid({
        columns: mockBasicColumns,
        data: mockData,
        hasNextPage: true,
        isLoading: true,
        onFetchNextPage: mockOnFetchNextPage,
        onFetchAllPages: mockOnFetchAllPages,
      });
      expect(screen.getByText('Charger plus')).toBeDisabled();
      expect(screen.getByText('Charger tout')).toBeDisabled();
    });
  });

  /* ---------------------------- Footer & Results --------------------------- */
  describe('Footer & Results', () => {
    it('should render footer with items count and total count', () => {
      renderDataGrid({ columns: mockBasicColumns, data: mockData, totalCount: 100 });
      expect(screen.getByText('2 sur 100 résultats')).toBeInTheDocument();
    });

    it('should render footer with zero items count', () => {
      renderDataGrid({ columns: mockBasicColumns, data: [], totalCount: 100 });
      expect(screen.getByText('0 sur 100 résultats')).toBeInTheDocument();
    });
  });

  /* ---------------------------- Advanced Features -------------------------- */
  describe('Advanced Features', () => {
    it('should handle row selection', () => {
      const { container } = renderDataGrid({
        columns: mockBasicColumns,
        data: mockData,
        rowSelection: mockRowSelection,
      });
      const targetDiv = container.querySelector('thead tr th label');
      expect(targetDiv).toBeInTheDocument();
      expect(targetDiv).toHaveAttribute('id', 'checkbox:select-all');
      const targetDivBody = container.querySelector('tbody tr td label');
      expect(targetDivBody).toBeInTheDocument();
      expect(targetDivBody).toHaveAttribute('id', 'checkbox:1');
    });

    it('should disable row checkbox when enableRowSelection returns false', () => {
      const { container } = renderDataGrid({
        columns: mockBasicColumns,
        data: mockData,
        rowSelection: {
          ...mockRowSelection,
          enableRowSelection: ({ original }) => original.id !== '1',
        },
      });

      const firstRowCheckbox = container.querySelector('#checkbox\\:1\\:input');
      const secondRowCheckbox = container.querySelector('#checkbox\\:2\\:input');

      expect(firstRowCheckbox).toBeDisabled();
      expect(secondRowCheckbox).not.toBeDisabled();
    });

    it('should call enableRowSelection for each row', () => {
      const enableRowSelection = vi.fn(() => true);

      renderDataGrid({
        columns: mockBasicColumns,
        data: mockData,
        rowSelection: {
          ...mockRowSelection,
          enableRowSelection,
        },
      });

      expect(enableRowSelection).toHaveBeenCalledWith(
        expect.objectContaining({ original: mockData[0] }),
      );
      expect(enableRowSelection).toHaveBeenCalledWith(
        expect.objectContaining({ original: mockData[1] }),
      );
    });

    it('should handle expandable rows', () => {
      const { container } = renderDataGrid({
        columns: mockBasicColumns,
        data: mockData,
        expandable: { expanded: {}, setExpanded: vi.fn() },
        renderSubComponent: mockRenderSubComponent,
      });
      const icon = container.querySelector('tbody tr td div button span');
      expect(icon).toBeInTheDocument();
      expect(icon?.className).toContain('chevron-right');
    });

    it('should handle loading state', () => {
      const { container } = renderDataGrid({
        columns: mockBasicColumns,
        data: [],
        isLoading: true,
      });
      const skeleton = container.querySelector('tbody tr td div div');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton?.className).toContain('skeleton');
    });

    it('should handle content alignment left', () => {
      renderDataGrid({
        columns: mockBasicColumns,
        data: mockData,
        contentAlignLeft: true,
      });
      expect(screen.getByText('name')).toHaveClass('pl-4');
    });

    it('should handle content alignment center', () => {
      renderDataGrid({
        columns: mockBasicColumns,
        data: mockData,
        contentAlignLeft: false,
      });
      expect(screen.getByText('name')).toHaveClass('text-center');
    });
  });

  /* ------------------------- All Features Combined ------------------------- */
  describe('Table Styles', () => {
    it('should render with small size', () => {
      const { container } = renderDataGrid({
        columns: mockBasicColumns,
        data: mockData,
        size: TABLE_SIZE.sm,
      });
      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();
      expect(table?.className).toContain('table--sm');
    });

    it('should render with large size', () => {
      const { container } = renderDataGrid({
        columns: mockBasicColumns,
        data: mockData,
        size: TABLE_SIZE.lg,
      });
      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();
      expect(table?.className).toContain('table--lg');
    });

    it('should render with striped variant', () => {
      const { container } = renderDataGrid({
        columns: mockBasicColumns,
        data: mockData,
        variant: TABLE_VARIANT.striped,
      });
      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();
      expect(table?.className).toContain('table--striped');
    });
  });

  describe('All Features Combined', () => {
    it('should render with all features enabled', () => {
      const customTopbar = <div data-testid="custom-topbar">Custom Topbar</div>;
      renderDataGrid({
        columns: mockColumns,
        data: mockData,
        topbar: customTopbar,
        search: mockSearch,
        filters: mockFilters,
        columnVisibility: {
          columnVisibility: mockColumnVisibility,
          setColumnVisibility: mockSetColumnVisibility,
        },
        sorting: {
          sorting: [{ id: 'name', desc: false }],
          setSorting: mockOnSortChange,
          manualSorting: false,
        },
        rowSelection: mockRowSelection,
        expandable: { expanded: {}, setExpanded: vi.fn() },
        renderSubComponent: mockRenderSubComponent,
        hasNextPage: true,
        onFetchNextPage: mockOnFetchNextPage,
        onFetchAllPages: mockOnFetchAllPages,
        totalCount: 100,
        containerHeight: 500,
        resourceType: 'users',
      });

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
