import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TLoadBalancerListener } from '@/api/data/listener';
import {
  LoadBalancerOperatingStatusEnum,
  LoadBalancerProvisioningStatusEnum,
} from '@/api/data/load-balancer';
import { useLoadBalancerListeners } from '@/api/hook/useListener';
import { wrapper } from '@/wrapperRenders';

import ListenerList from './List.page';

vi.mock('@/api/hook/useListener');

describe('ListenerList', () => {
  it('displays spinner when data is pending', () => {
    vi.mocked(useLoadBalancerListeners).mockReturnValue({
      data: { rows: [], totalRows: 0, pageCount: 0 },
      isPending: true,
      error: null,
      isLoading: true,
    });

    render(<ListenerList />, { wrapper });

    expect(screen.getByTestId('listeners-spinner')).toBeInTheDocument();
  });

  it('renders datagrid when data is available', () => {
    const mockListeners = [
      {
        id: 'id1',
        name: 'Rule 1',
        protocol: 'http',
        port: 80,
        operatingStatus: LoadBalancerOperatingStatusEnum.ONLINE,
        provisioningStatus: LoadBalancerProvisioningStatusEnum.ACTIVE,
      },
    ] as TLoadBalancerListener[];
    vi.mocked(useLoadBalancerListeners).mockReturnValue({
      data: { rows: mockListeners, totalRows: 1, pageCount: 1 },
      isPending: false,
      error: null,
      isLoading: false,
    });

    render(<ListenerList />, { wrapper });

    expect(screen.getByText('Rule 1')).toBeInTheDocument();
  });
});
