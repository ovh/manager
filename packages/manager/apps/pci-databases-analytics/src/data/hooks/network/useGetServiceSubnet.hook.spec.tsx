import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import {
  mockedNetworks,
  mockedSubnets,
} from '@/__tests__/helpers/mocks/network';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { Service } from '@/types/cloud/project/database';
import { useGetServiceSubnet } from './useGetServiceSubnet.hook';
import { useGetNetwork } from './useGetNetwork.hook';
import { useGetSubnet } from './useGetSubnet.hook';

vi.mock('@/data/api/network/network.api', () => ({
  networkApi: {
    getPrivateNetworks: vi.fn(),
    getSubnets: vi.fn(),
  },
}));

vi.mock('./useGetNetwork.hook', () => ({
  useGetNetwork: vi.fn(),
}));

vi.mock('./useGetSubnet.hook', () => ({
  useGetSubnet: vi.fn(),
}));

describe('useGetServiceSubnet', () => {
  it('should return the correct subnet', async () => {
    const projectId = 'projectId';
    const service: Service = {
      ...mockedService,
      networkId: mockedNetworks[0].regions[0].openstackId,
      subnetId: mockedSubnets[0].id,
    };

    vi.mocked(useGetNetwork).mockReturnValue({
      data: [mockedNetworks[0]],
      isSuccess: true,
    } as any);

    vi.mocked(useGetSubnet).mockReturnValue({
      data: [mockedSubnets[0]],
      isSuccess: true,
    } as any);

    const { result } = renderHook(
      () => useGetServiceSubnet(projectId, service),
      {
        wrapper: QueryClientWrapper,
      },
    );

    await waitFor(() => {
      expect(result.current).toEqual(mockedSubnets[0]);
      expect(useGetNetwork).toHaveBeenCalledWith(projectId);
      expect(useGetSubnet).toHaveBeenCalledWith(
        projectId,
        mockedNetworks[0].id,
        {
          enabled: true,
        },
      );
    });
  });
});
