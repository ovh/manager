import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TableHeaderContent } from '@/components/datagrid/table/table-head/table-header-content/TableHeaderContent.component';

import {
  mockHeaderGroups,
  mockHeaderGroupsManualSort,
  mockHeaderGroupsMultiSort,
  mockHeaderGroupsWithAscSort,
  mockHeaderGroupsWithSorting,
  mockOnSortChange,
} from '../../../__mocks__';

describe('TableHeaderContent', () => {
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
          enableSorting
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
          headerGroups={mockHeaderGroupsWithSorting}
          enableSorting
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
          headerGroups={mockHeaderGroupsWithAscSort}
          enableSorting
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
          headerGroups={mockHeaderGroupsMultiSort}
          enableSorting
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
          headerGroups={mockHeaderGroups}
          enableSorting
          onSortChange={mockOnSortChange}
        />
      </table>,
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('should handle manual sorting mode', () => {
    const mockToggleSorting = vi.fn();

    render(
      <table>
        <TableHeaderContent
          headerGroups={mockHeaderGroupsManualSort}
          enableSorting
          onSortChange={mockOnSortChange}
        />
      </table>,
    );

    const nameHeader = screen.getByTestId('header-name');
    fireEvent.click(nameHeader);
    expect(mockToggleSorting).toHaveBeenCalled();
  });
});
