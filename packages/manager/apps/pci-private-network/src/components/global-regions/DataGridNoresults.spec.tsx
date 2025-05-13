import { describe, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DataGridNoResults from '@/components/global-regions/DatagridNoResults';

describe('DataGridNoResults', () => {
  it('should render no results message', () => {
    render(
      <table>
        <thead>
          <DataGridNoResults />
        </thead>
      </table>,
    );
    expect(
      screen.getByText('common_pagination_no_results'),
    ).toBeInTheDocument();
  });
});
