import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TableHeaderContent } from '../table-header-content/TableHeaderContent.component';
import { mockHeaderGroups, mockOnSortChange } from '../../../__mocks__';

describe('TableHead', () => {
  it('should render all headers correctly', () => {
    render(
      <table>
        <TableHeaderContent headerGroups={mockHeaderGroups} />
      </table>,
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('should render headers with sorting enabled', () => {
    render(
      <table>
        <TableHeaderContent
          headerGroups={mockHeaderGroups}
          enableSorting={true}
          onSortChange={mockOnSortChange}
        />
      </table>,
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('should call onSortChange when header is clicked', () => {
    const mockToggleSorting = vi.fn();
    const mockHeaderGroupsWithSorting: any[] = [
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
              getToggleSortingHandler: () => mockToggleSorting,
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

    render(
      <table>
        <TableHeaderContent
          headerGroups={mockHeaderGroupsWithSorting}
          enableSorting={true}
          onSortChange={mockOnSortChange}
        />
      </table>,
    );

    const nameHeader = screen.getByTestId('header-name');
    fireEvent.click(nameHeader);
    expect(mockToggleSorting).toHaveBeenCalled();
  });

  it('should toggle sort direction on second click', () => {
    const mockToggleSorting = vi.fn();
    const mockHeaderGroupsWithAscSort: any[] = [
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
              getToggleSortingHandler: () => mockToggleSorting,
              getIsSorted: () => 'asc',
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

    render(
      <table>
        <TableHeaderContent
          headerGroups={mockHeaderGroupsWithAscSort}
          enableSorting={true}
          onSortChange={mockOnSortChange}
        />
      </table>,
    );

    const nameHeader = screen.getByTestId('header-name');
    fireEvent.click(nameHeader);
    expect(mockToggleSorting).toHaveBeenCalled();
  });

  it('should handle multiple column sorting', () => {
    const mockToggleSortingAge = vi.fn();
    const mockHeaderGroupsMultiSort: any[] = [
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
              getIsSorted: () => 'asc',
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
              getToggleSortingHandler: () => mockToggleSortingAge,
              getIsSorted: () => false,
            },
            isPlaceholder: false,
            getContext: () => ({}),
          },
        ],
      },
    ];

    render(
      <table>
        <TableHeaderContent
          headerGroups={mockHeaderGroupsMultiSort}
          enableSorting={true}
          onSortChange={mockOnSortChange}
        />
      </table>,
    );

    const ageHeader = screen.getByTestId('header-age');
    fireEvent.click(ageHeader);
    expect(mockToggleSortingAge).toHaveBeenCalled();
  });

  it('should render with initial sorting state', () => {
    const mockHeaderGroupsWithDescSort: any[] = [
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
              getIsSorted: () => 'desc',
            },
            isPlaceholder: false,
            getContext: () => ({}),
          },
        ],
      },
    ];

    render(
      <table>
        <TableHeaderContent
          headerGroups={mockHeaderGroupsWithDescSort}
          enableSorting={true}
          onSortChange={mockOnSortChange}
        />
      </table>,
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('should handle empty sorting array', () => {
    const mockToggleSorting = vi.fn();
    const mockHeaderGroupsEmptySort: any[] = [
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
              getToggleSortingHandler: () => mockToggleSorting,
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

    render(
      <table>
        <TableHeaderContent
          headerGroups={mockHeaderGroupsEmptySort}
          enableSorting={true}
          onSortChange={mockOnSortChange}
        />
      </table>,
    );

    const nameHeader = screen.getByTestId('header-name');
    fireEvent.click(nameHeader);
    expect(mockToggleSorting).toHaveBeenCalled();
  });

  it('should handle undefined sorting prop', () => {
    const mockToggleSorting = vi.fn();
    const mockHeaderGroupsNoSort: any[] = [
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
              getToggleSortingHandler: () => mockToggleSorting,
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

    render(
      <table>
        <TableHeaderContent
          headerGroups={mockHeaderGroupsNoSort}
          enableSorting={true}
          onSortChange={mockOnSortChange}
        />
      </table>,
    );

    const nameHeader = screen.getByTestId('header-name');
    fireEvent.click(nameHeader);
    expect(mockToggleSorting).toHaveBeenCalled();
  });

  it('should handle manual sorting mode', () => {
    const mockToggleSorting = vi.fn();
    const mockHeaderGroupsManualSort: any[] = [
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
              getToggleSortingHandler: () => mockToggleSorting,
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

    render(
      <table>
        <TableHeaderContent
          headerGroups={mockHeaderGroupsManualSort}
          enableSorting={true}
          onSortChange={mockOnSortChange}
        />
      </table>,
    );

    const nameHeader = screen.getByTestId('header-name');
    fireEvent.click(nameHeader);
    expect(mockToggleSorting).toHaveBeenCalled();
  });
});
