import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, vi } from 'vitest';
import { getInstances, TInstance } from '@ovh-ux/manager-pci-common';
import { useInstance, useInstances } from '@/api/hooks/useInstance';
import { getInstance, Instance } from '@/api/data/instance';

vi.mock('@/api/data/instance', () => ({
  getInstance: vi.fn(),
}));

vi.mock('@ovh-ux/manager-pci-common', () => ({
  getInstances: vi.fn(),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const mockInstance: Instance = {
  id: '1',
  name: 'Instance 1',
  ipAddresses: [],
  created: '',
  region: '',
  monthlyBilling: null,
  status: '',
  planCode: '',
  operationIds: [],
  currentMonthOutgoingTraffic: 0,
};

const mockInstances: TInstance[] = [
  {
    created: '',
    flavorId: '',
    id: '1',
    imageId: '',
    ipAddresses: [],
    name: 'Instance 1',
    operationIds: [],
    planCode: '',
    region: '',
    status: '',
  },
  {
    created: '',
    flavorId: '',
    id: '2',
    imageId: '',
    ipAddresses: [],
    name: 'Instance 2',
    operationIds: [],
    planCode: '',
    region: '',
    status: '',
  },
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useInstance', () => {
  it('returns instance data when instanceId is provided', async () => {
    vi.mocked(getInstance).mockResolvedValue(mockInstance);
    const { result } = renderHook(() => useInstance('123', '1'), {
      wrapper,
    });

    await waitFor(() => {
      expect(getInstance).toHaveBeenCalledWith('123', '1');
      expect(result.current.data).toEqual(mockInstance);
    });
  });

  it('does not fetch data when instanceId is not provided', () => {
    const { result } = renderHook(() => useInstance('123', null), { wrapper });

    expect(getInstance).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(true);
  });
});

describe('useInstances', () => {
  it('returns instances data when region is provided', async () => {
    vi.mocked(getInstances).mockResolvedValue(mockInstances);

    const { result } = renderHook(() => useInstances('123', 'region1'), {
      wrapper,
    });

    await waitFor(() => {
      expect(getInstances).toHaveBeenCalledWith('123', 'region1');
      expect(result.current.data).toEqual(mockInstances);
    });
  });

  it('does not fetch data when region is not provided', () => {
    const { result } = renderHook(() => useInstances('123', null), { wrapper });

    expect(getInstances).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(true);
  });
});
