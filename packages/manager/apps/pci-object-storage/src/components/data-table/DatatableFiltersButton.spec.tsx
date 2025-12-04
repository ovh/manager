import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DatatableFiltersButton } from './DatatableFiltersButton.component';

// Mock le contexte une seule fois pour tous les tests
const filtersDefinitionMock = [
  { id: 'name', label: 'Name', comparators: ['includes'] },
];
const addFilterMock = vi.fn();

vi.mock('@/hooks/useDateFnsLocale.hook', () => ({
  useDateFnsLocale: () => 'en-US',
}));

vi.mock('./DataTable.context', () => ({
  useDataTableContext: () => ({
    filtersDefinition: filtersDefinitionMock,
    columnFilters: { addFilter: addFilterMock },
  }),
}));

describe('DatatableFiltersButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders open-filter-menu-button if no children', () => {
    render(<DatatableFiltersButton />);
    expect(screen.getByTestId('open-filter-menu-button')).toBeInTheDocument();
  });

  it('renders children if provided', () => {
    render(
      <DatatableFiltersButton>
        <button data-testid="custom-child">Custom</button>
      </DatatableFiltersButton>,
    );
    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    expect(
      screen.queryByTestId('open-filter-menu-button'),
    ).not.toBeInTheDocument();
  });
});
