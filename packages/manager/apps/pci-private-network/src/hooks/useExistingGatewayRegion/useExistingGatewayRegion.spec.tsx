import { describe, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import useExistingGatewayRegion from './useExistingGatewayRegion';

const { useGatewayByRegion, gateways, gatewaysExternalInfo } = vi.hoisted(
  () => ({
    useGatewayByRegion: vi.fn(),
    gateways: [
      {
        id: 'gatewayid1',
        name: 'gateway1',
        region: 'SGP1',
      },
      {
        id: 'gatewayid2',
        name: 'gateway2',
        region: 'GRA11',
      },
    ],
    gatewaysExternalInfo: [
      {
        id: 'gatewayid1',
        name: 'gateway1',
        region: 'SGP1',
      },
      {
        id: 'gatewayid2',
        name: 'gateway2',
        region: 'GRA11',
        externalInformation: {
          ips: [{ ip: 'ip1', subnetId: 'subnetId' }],
          networkId: 'net1',
        },
      },
    ],
  }),
);

vi.mock('@ovh-ux/manager-pci-common', () => ({
  useProject: vi.fn().mockReturnValue({ data: {} }),
}));

vi.mock('@/data/hooks/gateway/useGateway', () => ({
  useGatewayByRegion,
}));

describe('useExistingGatewayRegion', () => {
  it('should return the first gateways found when there is no gateway with externalInformation', () => {
    useGatewayByRegion.mockReturnValue({ data: gateways, isLoading: false });
    const { result } = renderHook(() => useExistingGatewayRegion('SGP1'));

    expect(result.current).toEqual({ gateway: gateways[0], isLoading: false });
  });

  it('should return the first gateways found whith externalInformation', () => {
    useGatewayByRegion.mockReturnValue({
      data: gatewaysExternalInfo,
      isLoading: false,
    });
    const { result } = renderHook(() => useExistingGatewayRegion('SGP1'));

    expect(result.current).toEqual({
      gateway: gatewaysExternalInfo[1],
      isLoading: false,
    });
  });
});
