import { vi } from 'vitest';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';

// Mock IAM hook response
export const mockIamResponse = {
  isAuthorized: true,
  isLoading: false,
  isFetched: true,
};

// Common mock columns with different configurations
export const mockColumns = [
  {
    id: 'name',
    accessorKey: 'name',
    label: 'Name',
    cell: (props: any) => <div>{props.getValue()}</div>,
    isSearchable: true,
    isSortable: true,
    isFilterable: true,
    enableHiding: true,
    type: FilterTypeCategories.String,
  },
  {
    id: 'age',
    accessorKey: 'age',
    label: 'Age',
    cell: (props: any) => <div>{props.getValue()}</div>,
    isSortable: true,
    isFilterable: true,
    enableHiding: true,
    type: FilterTypeCategories.Numeric,
  },
];

// Basic mock columns (without search/filter features)
export const mockBasicColumns = [
  {
    id: 'name',
    accessorKey: 'name',
    label: 'Name',
    cell: (props: any) => <div>{props.getValue()}</div>,
    isSortable: true,
  },
  {
    id: 'age',
    accessorKey: 'age',
    label: 'Age',
    cell: (props: any) => <div>{props.getValue()}</div>,
    isSortable: true,
  },
];

// Mock data
export const mockData = [
  {
    name: 'John Doe',
    age: 30,
    subRows: [
      {
        name: 'John Doe Jr.',
        age: 10,
      },
      {
        name: 'John Doe Jr. 2',
        age: 11,
      },
      {
        name: 'John Doe Jr. 3',
        age: 12,
      },
    ],
  },
  {
    name: 'Jane Smith',
    age: 25,
  },
];

// Extended mock data for testing pagination
export const mockExtendedData = [
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

// Mock visible columns for topbar tests
export const mockVisibleColumns = [
  {
    id: 'name',
    columnDef: { header: 'Name', enableHiding: true },
    getIsVisible: vi.fn(() => true),
    getCanHide: vi.fn(() => true),
    getToggleVisibilityHandler: vi.fn(() => vi.fn()),
  } as any,
  {
    id: 'age',
    columnDef: { header: 'Age', enableHiding: true },
    getIsVisible: vi.fn(() => true),
    getCanHide: vi.fn(() => true),
    getToggleVisibilityHandler: vi.fn(() => vi.fn()),
  } as any,
];

// Mock search props
export const mockSearch = {
  onSearch: vi.fn(),
  searchInput: 'test',
  setSearchInput: vi.fn(),
  placeholder: 'Search...',
};

// Mock search with empty input
export const mockEmptySearch = {
  onSearch: vi.fn(),
  searchInput: '',
  setSearchInput: vi.fn(),
  placeholder: 'Search users...',
};

// Mock filters
export const mockFilters = {
  add: vi.fn(),
  remove: vi.fn(),
  filters: [],
};

// Mock filters with active data
export const mockFiltersWithData = {
  add: vi.fn(),
  remove: vi.fn(),
  filters: [
    {
      key: 'name',
      label: 'Name',
      value: 'John',
      comparator: 'contains' as any,
    },
  ],
};

// Mock filters with multiple active filters
export const mockFiltersWithMultipleData = {
  add: vi.fn(),
  remove: vi.fn(),
  filters: [
    {
      key: 'name',
      label: 'Name',
      value: 'John',
      comparator: 'contains' as any,
    },
    {
      key: 'age',
      label: 'Age',
      value: '25',
      comparator: 'equals' as any,
    },
  ],
};

// Mock column visibility
export const mockColumnVisibility = { name: true, age: true };
export const mockSetColumnVisibility = vi.fn();

// Mock sort change handler
export const mockOnSortChange = vi.fn();

// Mock render sub component
export const mockRenderSubComponent = vi.fn(() => <div>Sub content</div>);

// Mock row selection
export const mockRowSelection = {
  rowSelection: {},
  setRowSelection: vi.fn(),
  onRowSelectionChange: vi.fn(),
};

// Mock pagination handlers
export const mockOnFetchNextPage = vi.fn();
export const mockOnFetchAllPages = vi.fn();

// Mock column visibility functions
export const mockGetIsAllColumnsVisible = vi.fn(() => true);
export const mockGetIsSomeColumnsVisible = vi.fn(() => false);
export const mockToggleAllColumnsVisible = vi.fn();

// Mock partial column visibility (some columns hidden)
export const mockPartialVisibleColumns = [
  {
    id: 'name',
    columnDef: { header: 'Name', enableHiding: true },
    getIsVisible: vi.fn(() => true),
    getCanHide: vi.fn(() => true),
    getToggleVisibilityHandler: vi.fn(() => vi.fn()),
  } as any,
  {
    id: 'age',
    columnDef: { header: 'Age', enableHiding: true },
    getIsVisible: vi.fn(() => false),
    getCanHide: vi.fn(() => true),
    getToggleVisibilityHandler: vi.fn(() => vi.fn()),
  } as any,
];

// Mock columns without search feature
export const mockColumnsWithoutSearch = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    isSearchable: false,
    isFilterable: true,
    enableHiding: true,
  },
];

// Mock columns without filter feature
export const mockColumnsWithoutFilter = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    isSearchable: true,
    isFilterable: false,
    enableHiding: true,
  },
];

// Mock columns without visibility feature
export const mockColumnsWithoutVisibility = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    isSearchable: true,
    isFilterable: true,
    enableHiding: false,
  },
];

// Mock visible columns without hiding capability
export const mockVisibleColumnsWithoutHiding = [
  {
    id: 'name',
    columnDef: { header: 'Name', enableHiding: false },
    getIsVisible: vi.fn(() => true),
    getCanHide: vi.fn(() => false),
    getToggleVisibilityHandler: vi.fn(() => vi.fn()),
  } as any,
];

// Mock sorting states
export const mockSortingAsc = [{ id: 'name', desc: false }];
export const mockSortingDesc = [{ id: 'age', desc: true }];
export const mockEmptySorting: any[] = [];

// Mock virtualizer for TableBody tests
export const mockVirtualizer = {
  getTotalSize: () => 100,
  getVirtualItems: () => [
    { index: 0, key: 0, start: 0, size: 50 },
    { index: 1, key: 1, start: 50, size: 50 },
  ],
  measureElement: () => {},
  overscan: 40,
  scrollToIndex: vi.fn(),
};

// Mock table container ref
export const mockTableContainerRef = {
  current: document.createElement('div'),
};

// Mock row model
export const mockRowModel = {
  rows: [
    {
      id: '0',
      getVisibleCells: () => [
        {
          id: 'name-0',
          column: {
            getSize: () => 150,
            columnDef: { minSize: 20, maxSize: 'auto' },
          },
        },
        {
          id: 'age-0',
          column: {
            getSize: () => 150,
            columnDef: { minSize: 20, maxSize: 'auto' },
          },
        },
      ],
      getIsExpanded: () => false,
    },
    {
      id: '1',
      getVisibleCells: () => [
        {
          id: 'name-1',
          column: {
            getSize: () => 150,
            columnDef: { minSize: 20, maxSize: 'auto' },
          },
        },
        {
          id: 'age-1',
          column: {
            getSize: () => 150,
            columnDef: { minSize: 20, maxSize: 'auto' },
          },
        },
      ],
      getIsExpanded: () => false,
    },
  ],
};

// Mock header groups
export const mockHeaderGroups: any[] = [
  {
    id: 'header-group-0',
    depth: 0,
    headers: [
      {
        id: 'name',
        column: {
          getSize: () => 150,
          columnDef: { minSize: 20, maxSize: 'auto', header: 'Name' },
          getCanSort: () => true,
          getToggleSortingHandler: () => vi.fn(),
          getIsSorted: () => false,
        },
        isPlaceholder: false,
        getContext: () => ({}),
      },
      {
        id: 'age',
        column: {
          getSize: () => 150,
          columnDef: { minSize: 20, maxSize: 'auto', header: 'Age' },
          getCanSort: () => true,
          getToggleSortingHandler: () => vi.fn(),
          getIsSorted: () => false,
        },
        isPlaceholder: false,
        getContext: () => ({}),
      },
    ],
  },
];

// Mock virtual row for SubRow tests
export const mockVirtualRow = {
  index: 0,
  key: 0,
  start: 0,
  size: 50,
};

// Mock row for SubRow tests
export const mockRow = {
  id: '0',
  getVisibleCells: () => [],
  getIsExpanded: () => true,
};

// Mock columns for LoadingRow tests
export const mockLoadingColumns = [
  {
    id: 'name',
    getIsVisible: () => true,
  },
  {
    id: 'age',
    getIsVisible: () => true,
  },
] as any[];
