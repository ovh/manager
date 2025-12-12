import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DatatableFiltersList } from './DatatableFiltersList.component';

// Mock useLocale
vi.mock('@/hooks/useLocale', () => ({
  useLocale: () => 'fr_FR',
}));

const removeFilterMock = vi.fn();
const filtersMock = [
  {
    key: 'name',
    value: 'John',
    comparator: 'includes',
    label: 'Name',
  },
  {
    key: 'date',
    value: '2024-06-01',
    comparator: 'is_before',
    label: 'Date',
  },
  {
    key: 'status',
    value: ['active', 'pending'],
    comparator: 'is_in',
    label: 'Status',
  },
];

vi.mock('./DataTable.context', () => ({
  useDataTableContext: () => ({
    columnFilters: {
      filters: filtersMock,
      removeFilter: removeFilterMock,
    },
  }),
}));

describe('DatatableFiltersList', () => {
  it('renders all filters as badges', () => {
    render(<DatatableFiltersList />);
    expect(
      screen.getByText('Name common_criteria_adder_operator_includes John'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Date common_criteria_adder_operator_is_before 01/06/2024',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Status common_criteria_adder_operator_is_in active, pending',
      ),
    ).toBeInTheDocument();
  });

  it('calls removeFilter when remove button is clicked', () => {
    render(<DatatableFiltersList />);
    const removeBtns = screen.getAllByTestId('remove-btn');
    fireEvent.click(removeBtns[0]);
    expect(removeFilterMock).toHaveBeenCalledWith(filtersMock[0]);
  });
});
