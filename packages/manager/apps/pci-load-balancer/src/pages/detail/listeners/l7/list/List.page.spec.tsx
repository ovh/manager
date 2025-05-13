import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import L7PoliciesList from './List.page';
import { useL7Policies } from '@/api/hook/useL7Policy';
import { wrapper } from '@/wrapperRenders';
import { TL7Policy } from '@/api/data/l7Policies';

vi.mock('@/api/hook/useL7Policy', async () => {
  const mod = await vi.importActual('@/api/hook/useL7Policy');
  return {
    ...mod,
    useL7Policies: vi.fn(),
  };
});

describe('ListingPage', () => {
  it('should render the page with loading spinner', () => {
    vi.mocked(useL7Policies).mockReturnValue({
      allL7Policies: [],
      paginatedL7Policies: {
        pageCount: 0,
        totalRows: 0,
        rows: [],
      },
      isLoading: true,
      isPending: true,
      error: null,
    });

    render(<L7PoliciesList />, { wrapper });

    expect(screen.getByTestId('List-spinner')).toBeInTheDocument();
  });

  it('should render the page with data', () => {
    const mockL7Policies = [{ id: 'id1', name: 'L7 Policy 1' }] as TL7Policy[];
    vi.mocked(useL7Policies).mockReturnValue({
      paginatedL7Policies: {
        rows: mockL7Policies,
        totalRows: 1,
        pageCount: 1,
      },
      allL7Policies: mockL7Policies,
      isLoading: false,
      isPending: false,
      error: null,
    });
    render(<L7PoliciesList />, { wrapper });
    expect(screen.getByText('L7 Policy 1')).toBeInTheDocument();
  });
});
