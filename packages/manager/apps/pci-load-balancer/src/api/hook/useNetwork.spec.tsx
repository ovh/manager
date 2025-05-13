import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  usePrivateNetworkByRegion,
  useSubnetByNetworkAndRegion,
  useGetPrivateNetworks,
  useGetPrivateNetworkSubnets,
  useGetRegionPrivateNetworks,
} from './useNetwork';
import {
  getPrivateNetworkByRegion,
  getPrivateNetworks,
  getPrivateNetworkSubnets,
  getRegionPrivateNetworks,
  getSubnetByNetworkAndRegion,
  TNetwork,
  TPrivateNetwork,
  TSubnet,
} from '../data/network';
import { wrapper } from '@/wrapperRenders';

vi.mock('../data/network');

describe('useNetwork hooks', () => {
  it('usePrivateNetworkByRegion should fetch private network by region', async () => {
    const mockData = { id: 'network-1' } as TNetwork;
    vi.mocked(getPrivateNetworkByRegion).mockResolvedValue(mockData);

    const { result } = renderHook(
      () =>
        usePrivateNetworkByRegion({
          projectId: 'project-1',
          region: 'region-1',
          networkId: 'network-1',
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
  });

  it('useSubnetByNetworkAndRegion should fetch subnet by network and region', async () => {
    const mockData = { id: 'subnet-1' } as TSubnet;
    vi.mocked(getSubnetByNetworkAndRegion).mockResolvedValue(mockData);

    const { result } = renderHook(
      () =>
        useSubnetByNetworkAndRegion({
          projectId: 'project-1',
          region: 'region-1',
          networkId: 'network-1',
          subnetId: 'subnet-1',
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
  });

  it('useGetPrivateNetworks should fetch private networks', async () => {
    const mockData = [{ id: 'network-1' }] as TPrivateNetwork[];
    vi.mocked(getPrivateNetworks).mockResolvedValue(mockData);

    const { result } = renderHook(() => useGetPrivateNetworks('project-1'), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
  });

  it('useGetPrivateNetworkSubnets should fetch private network subnets', async () => {
    const mockData = [{ id: 'subnet-1' }] as TSubnet[];
    vi.mocked(getPrivateNetworkSubnets).mockResolvedValue(mockData);

    const { result } = renderHook(
      () => useGetPrivateNetworkSubnets('project-1', 'region-1', 'network-1'),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
  });

  it('useGetRegionPrivateNetworks should fetch region private networks', async () => {
    const mockData = [{ id: 'network-1' }] as TPrivateNetwork[];
    vi.mocked(getRegionPrivateNetworks).mockResolvedValue(mockData);

    const { result } = renderHook(
      () => useGetRegionPrivateNetworks('project-1', 'region-1'),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
  });
});
