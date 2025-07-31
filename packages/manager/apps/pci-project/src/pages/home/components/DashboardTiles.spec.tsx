/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { setupAllMocks, mockDashboardSections } from '@/data/__mocks__';

import { useDashboardSections } from './useDashboardSections.hook';
import DashboardTiles from './DashboardTiles.component';

setupAllMocks();

vi.mock('./useDashboardSections.hook', () => ({
  useDashboardSections: vi.fn(),
}));

describe('DashboardTiles', () => {
  it('shows error banner when hook returns error', async () => {
    vi.mocked(useDashboardSections).mockReturnValue({
      sections: [],
      isLoading: false,
      isError: true,
      error: { message: 'error', name: 'Error' },
    });
    render(<DashboardTiles projectId="1" />);
    expect(screen.getByTestId('error-banner')).toBeInTheDocument();
  });

  it('renders tiles when data is available', async () => {
    vi.mocked(useDashboardSections).mockReturnValue({
      sections: mockDashboardSections.map((s) => ({
        title: s.title,
        type: 'documentation',
        items: s.items.map((item) => ({
          ...item,
          label: item.label || item.title,
        })),
      })),
      isLoading: false,
      isError: false,
      error: null,
    });
    render(<DashboardTiles projectId="1" />);
    const regions = screen.getAllByRole('region');
    expect(regions.length).toBeGreaterThan(0);
  });

  it('shows loading state when hook returns loading', async () => {
    vi.mocked(useDashboardSections).mockReturnValue({
      sections: [],
      isLoading: true,
      isError: false,
      error: null,
    });
    render(<DashboardTiles projectId="1" />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });
});
