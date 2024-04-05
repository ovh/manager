import { expect, describe, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useVrack } from '@/hooks/useVrack';
import { QueryClientWrapper } from '../helpers/wrappers/QueryClientWrapper';
import { mockedNetworks, mockedSubnets } from '../helpers/mocks/network';

vi.mock('@/api/network', () => ({
  networkApi: {
    getPrivateNetworks: vi.fn(() => mockedNetworks),
    getSubnets: vi.fn(() => mockedSubnets),
    getVrack: vi.fn(),
  },
}));

describe('useVrack', () => {
  it('should init properly', async () => {
    const projectId = '123';
    const region = 'GRA';
    const { result } = renderHook(() => useVrack(projectId, region), {
      wrapper: QueryClientWrapper,
    });
    await waitFor(() => {
      expect(result.current.networks).toStrictEqual(mockedNetworks);
      expect(result.current.subnetQuery.status).toBe('pending');
    });
  });
  it('should fetch subnets when network is selected', async () => {
    const projectId = '123';
    const region = 'GRA';
    let networkId: string | undefined;
    const { result, rerender } = renderHook(
      () => useVrack(projectId, region, networkId),
      {
        wrapper: QueryClientWrapper,
      },
    );
    act(() => {
      networkId = result.current.networks[0].id;
      rerender([projectId, region, networkId]);
    });
    await waitFor(() => {
      expect(result.current.networks).toStrictEqual(mockedNetworks);
      expect(result.current.subnets).toStrictEqual(mockedSubnets);
    });
  });
});
