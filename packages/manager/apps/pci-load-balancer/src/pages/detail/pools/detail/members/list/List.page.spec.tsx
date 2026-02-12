import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  LoadBalancerOperatingStatusEnum,
  LoadBalancerProvisioningStatusEnum,
} from '@/api/data/load-balancer';
import { TPoolMember } from '@/api/data/pool-member';
import { usePoolMembers } from '@/api/hook/usePoolMember';
import { wrapper } from '@/wrapperRenders';

import PoolMemberList from './List.page';

vi.mock('@/api/hook/usePoolMember', async () => {
  const mod = await vi.importActual('@/api/hook/usePoolMember');
  return {
    ...mod,
    usePoolMembers: vi.fn(),
  };
});

describe('PoolMemberList Component', () => {
  it('should render a spinner', () => {
    vi.mocked(usePoolMembers).mockReturnValue({
      isLoading: true,
      allPoolMembers: [],
      paginatedPoolMembers: {
        pageCount: 0,
        totalRows: 0,
        rows: [],
      },
      isPending: true,
      error: null,
    });
    render(<PoolMemberList />, { wrapper });
    expect(screen.getByTestId('List-spinner')).toBeInTheDocument();
  });

  it('should render a list of members', () => {
    const poolMembers: TPoolMember[] = [
      {
        id: 'member-1',
        name: 'Member 1',
        address: '1.1.1.1',
        operatingStatus: LoadBalancerOperatingStatusEnum.ONLINE,
        protocolPort: 80,
        weight: 1,
        provisioningStatus: LoadBalancerProvisioningStatusEnum.ACTIVE,
      },
    ];
    vi.mocked(usePoolMembers).mockReturnValue({
      isLoading: false,
      allPoolMembers: poolMembers,
      paginatedPoolMembers: {
        pageCount: 1,
        totalRows: 1,
        rows: poolMembers,
      },
      isPending: false,
      error: null,
    });
    render(<PoolMemberList />, { wrapper });
    expect(screen.getByText('Member 1')).toBeInTheDocument();
  });
});
