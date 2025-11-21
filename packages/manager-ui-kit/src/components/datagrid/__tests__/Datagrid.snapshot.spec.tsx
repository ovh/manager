import { screen } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';

import { TABLE_SIZE, TABLE_VARIANT } from '@ovhcloud/ods-react';

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

  it.each([
    {
      description: 'basic props',
      props: { columns: mockBasicColumns, data: mockData },
    },
    {
      description: 'sorting enabled',
      props: {
        columns: mockBasicColumns,
        data: mockData,
        sorting: {
          sorting: [{ id: 'name', desc: false }],
          setSorting: mockOnSortChange,
          manualSorting: false,
        },
      },
    },
    {
      description: 'search enabled',
      props: {
        columns: mockBasicColumns,
        data: mockData,
        search: mockSearch,
      },
    },
    {
      description: 'filters enabled',
      props: {
        columns: mockBasicColumns,
        data: mockData,
        filters: mockFilters,
      },
    },
    {
      description: 'column visibility enabled',
      props: {
        columns: mockBasicColumns,
        data: mockData,
        columnVisibility: {
          columnVisibility: mockColumnVisibility,
          setColumnVisibility: mockSetColumnVisibility,
        },
      },
    },
    {
      description: 'pagination',
      props: {
        columns: mockBasicColumns,
        data: mockData,
        hasNextPage: true,
        onFetchNextPage: mockOnFetchNextPage,
        onFetchAllPages: mockOnFetchAllPages,
        totalCount: 100,
        isLoading: false,
      },
    },
    {
      description: 'loading state',
      props: {
        columns: mockBasicColumns,
        data: mockData,
        isLoading: true,
      },
    },
    {
      description: 'empty data',
      props: {
        columns: mockBasicColumns,
        data: [],
      },
    },
    {
      description: 'row selection',
      props: {
        columns: mockBasicColumns,
        data: mockData,
        rowSelection: mockRowSelection,
      },
    },
    {
      description: 'custom container height',
      props: {
        columns: mockBasicColumns,
        data: mockData,
        containerHeight: 400,
      },
    },
  ])('should match snapshot with $description', ({ props }) => {
    const { container } = renderDataGrid(props);
    expect(container.firstChild).toMatchSnapshot();
  });

  it.each([
    { size: TABLE_SIZE.sm, description: 'small size' },
    { size: TABLE_SIZE.md, description: 'medium size' },
    { size: TABLE_SIZE.lg, description: 'large size' },
  ])('should match snapshot with $description', ({ size }) => {
    const { container } = renderDataGrid({
      columns: mockBasicColumns,
      data: mockData,
      size,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with striped variant', () => {
    const { container } = renderDataGrid({
      columns: mockBasicColumns,
      data: mockData,
      variant: TABLE_VARIANT.striped,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with hideHeader enabled', () => {
    const { container } = renderDataGrid({
      columns: mockBasicColumns,
      data: mockData,
      hideHeader: true,
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

  it('should match snapshot with conditional row selection', () => {
    const { container } = renderDataGrid({
      columns: mockBasicColumns,
      data: mockData,
      rowSelection: {
        ...mockRowSelection,
        enableRowSelection: ({ original }) => original.id !== '1',
      },
    });
    expect(container.firstChild).toMatchSnapshot();
  });
});
