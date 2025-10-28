import { Dispatch, SetStateAction } from 'react';

import type { Column, HeaderContext, HeaderGroup, VisibilityState } from '@tanstack/react-table';
import { vi } from 'vitest';

import { FilterTypeCategories } from '@ovh-ux/manager-core-api';

import { Person } from '@/commons/tests-utils/Type.utils';
import { DatagridColumn } from '@/components/datagrid/Datagrid.props';
import { IamAuthorizationResponse } from '@/hooks/iam/IAM.type';

const createHeader = (
  id: string,
  header: string,
  toggleSorting: () => void = vi.fn(),
  isSorted: boolean | 'asc' | 'desc' = false,
) => ({
  id,
  column: {
    id,
    getSize: () => 150,
    columnDef: { minSize: 20, maxSize: 'auto', header },
    getCanSort: () => true,
    getToggleSortingHandler: () => toggleSorting,
    getIsSorted: () => isSorted,
  },
  isPlaceholder: false,
  getContext: () => ({}) as HeaderContext<Person, unknown>,
});

const createMockHeaderGroup = (
  headers: {
    id: string;
    header: string;
    isSorted?: boolean | 'asc' | 'desc';
  }[],
): HeaderGroup<Person>[] => [
  {
    id: 'header-group-0',
    depth: 0,
    headers: headers.map((h) => ({
      id: h.id,
      column: {
        id: h.id,
        getSize: () => 150,
        columnDef: { minSize: 20, maxSize: 'auto', header: h.header },
        getCanSort: () => true,
        getToggleSortingHandler: () => vi.fn(),
        getIsSorted: () => h.isSorted ?? false,
      },
      isPlaceholder: false,
      getContext: () => ({}),
    })),
    getSize: () => 300,
  } as unknown as HeaderGroup<Person>,
];

export const mockIamResponse: IamAuthorizationResponse = {
  isAuthorized: true,
  isLoading: false,
  isFetched: true,
};

export const mockData: Person[] = [
  { name: 'John Doe', age: 30 },
  { name: 'Jane Smith', age: 25 },
];

export const mockBasicColumns: readonly DatagridColumn<Person>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'name',
    label: 'Name',
    isSortable: true,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: 'age',
    accessorKey: 'age',
    header: 'age',
    label: 'Age',
    isSortable: true,
    cell: ({ getValue }) => <div>{getValue<number>()}</div>,
  },
] as const;

export const mockColumns: DatagridColumn<Person>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    label: 'Name',
    isSortable: true,
    isFilterable: true,
    isSearchable: true,
    enableHiding: true,
    type: FilterTypeCategories.String,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    id: 'age',
    accessorKey: 'age',
    label: 'Age',
    isSortable: true,
    isFilterable: true,
    enableHiding: true,
    type: FilterTypeCategories.Numeric,
    cell: ({ getValue }) => <div>{getValue<number>()}</div>,
  },
];

export const mockVisibleColumns: Column<Person, unknown>[] = [
  {
    id: 'name',
    columnDef: { header: 'Name', enableHiding: true },
    getIsVisible: vi.fn(() => true),
    getCanHide: vi.fn(() => true),
    getToggleVisibilityHandler: vi.fn(() => vi.fn()),
  } as unknown as Column<Person, unknown>,
  {
    id: 'age',
    columnDef: { header: 'Age', enableHiding: true },
    getIsVisible: vi.fn(() => true),
    getCanHide: vi.fn(() => true),
    getToggleVisibilityHandler: vi.fn(() => vi.fn()),
  } as unknown as Column<Person, unknown>,
];

export const mockSetColumnVisibility = vi.fn() as unknown as Dispatch<
  SetStateAction<VisibilityState>
>;

export const mockOnSortChange = vi.fn<(s: { id: string; desc: boolean }[]) => void>();

export const mockRenderSubComponent = vi.fn(() => <div>Sub content</div>);

export const mockRowSelection = {
  rowSelection: {},
  setRowSelection: vi.fn(),
  onRowSelectionChange: vi.fn(),
};

export const mockOnFetchNextPage = vi.fn();

export const mockOnFetchAllPages = vi.fn();

export const mockColumnVisibility = { name: true, age: true };

export const mockSearch = {
  onSearch: vi.fn(),
  searchInput: 'test',
  setSearchInput: vi.fn(),
  placeholder: 'Search...',
};

export const mockFilters = {
  add: vi.fn(),
  remove: vi.fn(),
  filters: [],
};

export const mockExtendedData: Person[] = Array.from({ length: 5 }, (_, i) => ({
  name: `Person ${i + 1}`,
  age: i + 25,
}));

export const mockHeaderGroups = createMockHeaderGroup([
  { id: 'name', header: 'Name' },
  { id: 'age', header: 'Age' },
]);

export const mockHeaderGroupsWithSorting = (toggleFn: () => void): HeaderGroup<Person>[] => [
  {
    id: 'header-group-0',
    depth: 0,
    headers: [
      {
        id: 'name',
        column: {
          id: 'name',
          getSize: () => 150,
          columnDef: { header: 'Name', minSize: 20, maxSize: 'auto' },
          getCanSort: () => true,
          getToggleSortingHandler: () => toggleFn,
          getIsSorted: () => false,
        },
        isPlaceholder: false,
        getContext: () => ({}) as HeaderContext<Person, unknown>,
      },
      {
        id: 'age',
        column: {
          id: 'age',
          getSize: () => 150,
          columnDef: { header: 'Age', minSize: 20, maxSize: 'auto' },
          getCanSort: () => true,
          getToggleSortingHandler: () => vi.fn(),
          getIsSorted: () => false,
        },
        isPlaceholder: false,
        getContext: () => ({}) as HeaderContext<Person, unknown>,
      },
    ],
    getSize: () => 300,
  } as unknown as HeaderGroup<Person>,
];

export const mockHeaderGroupsWithAscSort = (toggleFn: () => void): HeaderGroup<Person>[] => [
  {
    id: 'header-group-0',
    depth: 0,
    headers: [
      {
        id: 'name',
        isPlaceholder: false,
        column: {
          id: 'name',
          getSize: () => 150,
          columnDef: { header: 'Name', minSize: 20, maxSize: 'auto' },
          getCanSort: () => true,
          getToggleSortingHandler: () => toggleFn,
          getIsSorted: () => 'asc',
        },
        getContext: () => ({}) as HeaderContext<Person, unknown>,
      },
      {
        id: 'age',
        isPlaceholder: false,
        column: {
          id: 'age',
          getSize: () => 150,
          columnDef: { header: 'Age', minSize: 20, maxSize: 'auto' },
          getCanSort: () => true,
          getToggleSortingHandler: () => vi.fn(),
          getIsSorted: () => false,
        },
        getContext: () => ({}) as HeaderContext<Person, unknown>,
      },
    ],
    getSize: () => 300,
  } as unknown as HeaderGroup<Person>,
];

export const mockHeaderGroupsMultiSort = (toggleSorting: () => void): HeaderGroup<Person>[] => [
  {
    id: 'header-group-0',
    depth: 0,
    headers: [
      createHeader('name', 'Name', vi.fn(), 'asc'),
      createHeader('age', 'Age', toggleSorting, false),
    ],
    getSize: () => 300,
  } as unknown as HeaderGroup<Person>,
];

export const mockHeaderGroupsWithDescSort: HeaderGroup<Person>[] = [
  {
    id: 'header-group-0',
    depth: 0,
    headers: [
      createHeader('name', 'Name', vi.fn(), false),
      createHeader('age', 'Age', vi.fn(), 'desc'),
    ],
    getSize: () => 300,
  } as unknown as HeaderGroup<Person>,
];

export const mockHeaderGroupsEmptySort = (toggleSorting: () => void): HeaderGroup<Person>[] => [
  {
    id: 'header-group-0',
    depth: 0,
    headers: [
      createHeader('name', 'Name', toggleSorting, false),
      createHeader('age', 'Age', vi.fn(), false),
    ],
    getSize: () => 300,
  } as unknown as HeaderGroup<Person>,
];

export const mockHeaderGroupsNoSort = (toggleSorting: () => void): HeaderGroup<Person>[] => [
  {
    id: 'header-group-0',
    depth: 0,
    headers: [
      createHeader('name', 'Name', toggleSorting, false),
      createHeader('age', 'Age', vi.fn(), false),
    ],
    getSize: () => 300,
  } as unknown as HeaderGroup<Person>,
];

export const mockHeaderGroupsManualSort = (toggleSorting: () => void): HeaderGroup<Person>[] => [
  {
    id: 'header-group-0',
    depth: 0,
    headers: [
      createHeader('name', 'Name', toggleSorting, false),
      createHeader('age', 'Age', vi.fn(), false),
    ],
    getSize: () => 300,
  } as unknown as HeaderGroup<Person>,
];

export const mockColumnsWithoutVisibility: readonly DatagridColumn<Person>[] = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    isSearchable: true,
    isFilterable: true,
    enableHiding: false,
  },
];

export const mockVisibleColumnsWithoutHiding: Column<Person, unknown>[] = [
  {
    id: 'name',
    columnDef: { header: 'Name', enableHiding: false },
    getIsVisible: vi.fn(() => true),
    getCanHide: vi.fn(() => false),
    getToggleVisibilityHandler: vi.fn(() => vi.fn()),
  } as unknown as Column<Person, unknown>,
];
