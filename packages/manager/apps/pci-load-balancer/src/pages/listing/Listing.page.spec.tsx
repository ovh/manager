import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TLoadBalancer } from '@/api/data/load-balancer';
import * as useLoadBalancerModule from '@/api/hook/useLoadBalancer';
import { mockLoadBalancers } from '@/mocks';
import ListingPage from '@/pages/listing/Listing.page';
import { wrapper } from '@/wrapperRenders';

describe('ListingPage', () => {
  it('renders spinner when data is pending', () => {
    vi.spyOn(useLoadBalancerModule, 'useLoadBalancers').mockReturnValue({
      paginatedLoadBalancer: {
        rows: [] as TLoadBalancer[],
        totalRows: 0,
        pageCount: 0,
      },
      allLoadBalancer: [],
      isPending: true,
      isLoading: true,
      error: null,
    });
    const { getByTestId } = render(<ListingPage />, { wrapper });

    expect(getByTestId('redirectionGuard_spinner')).toBeInTheDocument();
  });

  it('renders datagrid with load balancers when data is available', () => {
    vi.spyOn(useLoadBalancerModule, 'useLoadBalancers').mockReturnValue({
      paginatedLoadBalancer: {
        rows: mockLoadBalancers,
        totalRows: 1,
        pageCount: 1,
      },
      allLoadBalancer: mockLoadBalancers,
      isPending: false,
      isLoading: false,
      error: null,
    });
    const { getByText } = render(<ListingPage />, { wrapper });
    expect(getByText(mockLoadBalancers[0].name)).toBeInTheDocument();
  });
});
