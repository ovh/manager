// FilterContext.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useDataGrid } from '@ovh-ux/manager-react-components';
import { FilterProvider } from './FilterContext.provider';
import useFilterContext from './useFilters';

const TestComponent: React.FC = () => {
  const {
    pagination,
    setPagination,
    filters,
    addFilter,
    removeFilter,
  } = useFilterContext();

  return (
    <div>
      <p>Current Page: {pagination.pageIndex}</p>
      <button
        onClick={() =>
          setPagination({
            ...pagination,
            pageIndex: pagination.pageIndex + 1,
          })
        }
      >
        Next Page
      </button>
      <div>
        <h2>Filters</h2>
        {filters.map((filter, index) => (
          <div key={index}>
            <p>
              Filter: {filter.key} - {filter.value}
            </p>
            <button onClick={() => removeFilter(filter)}>Remove Filter</button>
          </div>
        ))}
        <button
          onClick={() =>
            addFilter({
              comparator: 'includes',
              label: '',
              key: 'example',
              value: 'value',
            })
          }
        >
          Add Filter
        </button>
      </div>
    </div>
  );
};

describe('FilterProvider', () => {
  it('should provide pagination and filters context', () => {
    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>,
    );

    expect(screen.getByText('Current Page: 0')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Next Page'));
    expect(screen.getByText('Current Page: 1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Add Filter'));
    expect(screen.getByText('Filter: example - value')).toBeInTheDocument();
  });
});
