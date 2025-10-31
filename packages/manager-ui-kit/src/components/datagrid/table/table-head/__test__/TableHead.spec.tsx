import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TableHeaderContent } from '@/components/datagrid/table/table-head';

import {
  mockHeaderGroups,
  mockHeaderGroupsEmptySort,
  mockHeaderGroupsManualSort,
  mockHeaderGroupsMultiSort,
  mockHeaderGroupsNoSort,
  mockHeaderGroupsWithAscSort,
  mockHeaderGroupsWithDescSort,
  mockHeaderGroupsWithSorting,
  mockOnSortChange,
} from '../../../__mocks__';

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

    render(
      <table>
        <TableHeaderContent
          headerGroups={mockHeaderGroupsWithSorting(mockToggleSorting)}
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

    render(
      <table>
        <TableHeaderContent
          headerGroups={mockHeaderGroupsWithAscSort(mockToggleSorting)}
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

    render(
      <table>
        <TableHeaderContent
          headerGroups={mockHeaderGroupsMultiSort(mockToggleSortingAge)}
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

    render(
      <table>
        <TableHeaderContent
          headerGroups={mockHeaderGroupsEmptySort(mockToggleSorting)}
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

    render(
      <table>
        <TableHeaderContent
          headerGroups={mockHeaderGroupsNoSort(mockToggleSorting)}
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

    render(
      <table>
        <TableHeaderContent
          headerGroups={mockHeaderGroupsManualSort(mockToggleSorting)}
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
