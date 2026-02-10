import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  LoadBalancerOperatingStatusEnum,
  LoadBalancerProvisioningStatusEnum,
} from '@/api/data/load-balancer';
import { TLoadBalancerPool } from '@/api/data/pool';
import { useLoadBalancerPools } from '@/api/hook/usePool';

import PoolList from './List.page';

vi.mock('@/api/hook/usePool', () => ({
  useLoadBalancerPools: vi.fn(),
}));

describe('PoolList', () => {
  it('renders loading spinner when data is pending', () => {
    vi.mocked(useLoadBalancerPools).mockReturnValue({
      data: {
        pageCount: 0,
        rows: [],
        totalRows: 0,
      },
      error: null,
      isPending: true,
      isLoading: false,
    });

    render(<PoolList />);

    expect(screen.getByTestId('List-spinner')).toBeInTheDocument();
  });

  it('renders data grid when data is loaded', () => {
    vi.mocked(useLoadBalancerPools).mockReturnValue({
      data: {
        pageCount: 1,
        rows: [
          {
            id: 'pool-id',
            name: 'pool-name',
            protocol: 'http',
            operatingStatus: LoadBalancerOperatingStatusEnum.ONLINE,
            provisioningStatus: LoadBalancerProvisioningStatusEnum.ACTIVE,
          } as TLoadBalancerPool,
        ],
        totalRows: 1,
      },
      error: null,
      isPending: false,
      isLoading: false,
    });

    render(<PoolList />);
    expect(screen.getByText('pool-name')).toBeInTheDocument();
  });
});
