import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as API from '@/data/api/network/network.api';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedNetworks } from '@/__tests__/helpers/mocks/network';
import { useGetNetwork } from './useGetNetwork.hook';

vi.mock('@/data/api/network/network.api', () => ({
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
      expect(result.current.data).toEqual(mockedNetworks);
      expect(API.networkApi.getPrivateNetworks).toHaveBeenCalledWith(projectId);
    });
  });
});
