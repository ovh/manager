import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as API from '@/api/network';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import {
  useGetVrack,
  useGetNetwork,
  useGetSubnet,
} from '@/hooks/api/network.api.hooks';
import {
  mockedNetworks,
  mockedSubnets,
  mockedVrack,
} from '@/__tests__/helpers/mocks/network';

vi.mock('@/api/network', () => ({
  networkApi: {
    getPrivateNetworks: vi.fn(),
    getSubnets: vi.fn(),
    getVrack: vi.fn(),
  },
}));

describe('useGetNetwork', () => {
  it('should return network', async () => {
    const projectId = 'projectId';

    vi.mocked(API.networkApi.getPrivateNetworks).mockResolvedValue(
      mockedNetworks,
    );

    const { result } = renderHook(() => useGetNetwork(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      console.log(mockedNetworks);
      expect(result.current.data).toEqual(mockedNetworks);
      expect(API.networkApi.getPrivateNetworks).toHaveBeenCalledWith(projectId);
    });
  });
});

describe('useGetSubnet', () => {
  it('should return subnet', async () => {
    const projectId = 'projectId';
    const networkId = 'networkId';

    vi.mocked(API.networkApi.getSubnets).mockResolvedValue(mockedSubnets);

    const { result } = renderHook(() => useGetSubnet(projectId, networkId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedSubnets);
      expect(API.networkApi.getSubnets).toHaveBeenCalledWith(
        projectId,
        networkId,
      );
    });
  });
});

describe('useGetVrack', () => {
  it('should return vrack', async () => {
    const projectId = 'projectId';

    vi.mocked(API.networkApi.getVrack).mockResolvedValue(mockedVrack);

    const { result } = renderHook(() => useGetVrack(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedVrack);
      expect(API.networkApi.getVrack).toHaveBeenCalledWith(projectId);
    });
  });
});
