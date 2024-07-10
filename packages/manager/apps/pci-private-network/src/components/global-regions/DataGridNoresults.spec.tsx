import { describe, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DataGridNoResults from '@/components/global-regions/DatagridNoResults';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('DataGridNoResults', () => {
  it('should render no results message', () => {
    render(<DataGridNoResults />);
    expect(
      screen.getByText('common_pagination_no_results'),
    ).toBeInTheDocument();
  });
});
