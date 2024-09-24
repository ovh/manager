import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UseQueryResult } from '@tanstack/react-query';
import ListingPage from '@/pages/listing/Listing.page';
import * as useLoadBalancerModule from '@/api/hooks/useLoadBalancer';
import {
  useAllLoadBalancers,
  useLoadBalancers,
} from '@/api/hooks/useLoadBalancer';
import { TLoadBalancer } from '@/types';
import { wrapper } from '@/wrapperRenders';
import { mockLoadBalancers } from '@/mocks';

describe('ListingPage', () => {
  it('renders spinner when data is pending', () => {
    vi.spyOn(useLoadBalancerModule, 'useLoadBalancers').mockReturnValue({
      data: { rows: [] as TLoadBalancer[], totalRows: 0, pageCount: 0 },
      isPending: true,
      isLoading: true,
      error: null,
    });
    const { getByTestId } = render(<ListingPage />, { wrapper });
    expect(getByTestId('redirectionGuard_spinner')).toBeInTheDocument();
  });

  it('renders datagrid with load balancers when data is available', () => {
    vi.spyOn(useLoadBalancerModule, 'useAllLoadBalancers').mockReturnValue({
      data: mockLoadBalancers,
      isPending: false,
      isLoading: false,
      error: null,
    } as UseQueryResult<TLoadBalancer[]>);
    vi.spyOn(useLoadBalancerModule, 'useLoadBalancers').mockReturnValue({
      data: { rows: mockLoadBalancers, totalRows: 1, pageCount: 1 },
      isPending: false,
      isLoading: false,
      error: null,
    });
    const { getByText } = render(<ListingPage />, { wrapper });
    expect(getByText(mockLoadBalancers[0].name)).toBeInTheDocument();
  });
});
