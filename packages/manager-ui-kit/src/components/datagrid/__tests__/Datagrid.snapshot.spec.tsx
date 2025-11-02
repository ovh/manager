import { screen } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';

import { renderDataGrid } from '@/commons/tests-utils/Render.utils';
import { IamAuthorizationResponse } from '@/hooks/iam/IAM.type';
import { useAuthorizationIam } from '@/hooks/iam/useOvhIam';

import {
  mockBasicColumns,
  mockColumnVisibility,
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

// ✅ Vitest-compatible mock typing
const mockedHook = useAuthorizationIam as unknown as Mock<() => IamAuthorizationResponse>;

describe('Datagrid Snapshot Tests', () => {
  beforeEach(() => {
    mockedHook.mockReturnValue(mockIamResponse);
  });

  it('should match snapshot with basic props', () => {
    const { container } = renderDataGrid({ columns: mockBasicColumns, data: mockData });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with sorting enabled', () => {
    const { container } = renderDataGrid({
      columns: mockBasicColumns,
      data: mockData,
      sorting: {
        sorting: [{ id: 'name', desc: false }],
        setSorting: mockOnSortChange,
        manualSorting: false,
      },
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with search enabled', () => {
    const { container } = renderDataGrid({
      columns: mockBasicColumns,
      data: mockData,
      search: mockSearch,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with filters enabled', () => {
    const { container } = renderDataGrid({
      columns: mockBasicColumns,
      data: mockData,
      filters: mockFilters,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with column visibility enabled', () => {
    const { container } = renderDataGrid({
      columns: mockBasicColumns,
      data: mockData,
      columnVisibility: {
        columnVisibility: mockColumnVisibility,
        setColumnVisibility: mockSetColumnVisibility,
      },
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with pagination', () => {
    const { container } = renderDataGrid({
      columns: mockBasicColumns,
      data: mockData,
      hasNextPage: true,
      onFetchNextPage: mockOnFetchNextPage,
      onFetchAllPages: mockOnFetchAllPages,
      totalCount: 100,
      isLoading: false,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with loading state', () => {
    const { container } = renderDataGrid({
      columns: mockBasicColumns,
      data: mockData,
      isLoading: true,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with empty data', () => {
    const { container } = renderDataGrid({
      columns: mockBasicColumns,
      data: [],
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with expandable rows', () => {
    const { container } = renderDataGrid({
      columns: mockBasicColumns,
      data: mockData,
      expandable: { expanded: { 0: true, 1: true }, setExpanded: vi.fn() },
      renderSubComponent: mockRenderSubComponent,
      subComponentHeight: 80,
    });

    // Accept either ODS button or native button
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with row selection', () => {
    const { container } = renderDataGrid({
      columns: mockBasicColumns,
      data: mockData,
      rowSelection: mockRowSelection,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with custom container height', () => {
    const { container } = renderDataGrid({
      columns: mockBasicColumns,
      data: mockData,
      containerHeight: 400,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with all features enabled', () => {
    const { container } = renderDataGrid({
      columns: mockBasicColumns,
      data: mockData,
      sorting: {
        sorting: [{ id: 'name', desc: false }],
        setSorting: mockOnSortChange,
        manualSorting: true,
      },
      search: mockSearch,
      filters: mockFilters,
      columnVisibility: {
        columnVisibility: mockColumnVisibility,
        setColumnVisibility: mockSetColumnVisibility,
      },
      rowSelection: mockRowSelection,
      expandable: {
        expanded: {},
        setExpanded: vi.fn(),
      },
      renderSubComponent: mockRenderSubComponent,
      hasNextPage: true,
      onFetchNextPage: mockOnFetchNextPage,
      onFetchAllPages: mockOnFetchAllPages,
      totalCount: 100,
      containerHeight: 500,
    });
    expect(container.firstChild).toMatchSnapshot();
  });
});
