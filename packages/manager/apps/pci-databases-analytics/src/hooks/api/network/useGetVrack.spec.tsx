import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as API from '@/data/api/network/network.api';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedVrack } from '@/__tests__/helpers/mocks/network';
import { useGetVrack } from './useGetVrack.hook';

vi.mock('@/data/api/network/network.api', () => ({
  networkApi: {
    getPrivateNetworks: vi.fn(),
    getSubnets: vi.fn(),
    getVrack: vi.fn(),
  },
}));

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
