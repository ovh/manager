import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as API from '@/data/api/network/network.api';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedSubnets } from '@/__tests__/helpers/mocks/network';
import { useGetSubnet } from './useGetSubnet.hook';

vi.mock('@/data/api/network/network.api', () => ({
  networkApi: {
    getPrivateNetworks: vi.fn(),
    getSubnets: vi.fn(),
    getVrack: vi.fn(),
  },
}));

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
