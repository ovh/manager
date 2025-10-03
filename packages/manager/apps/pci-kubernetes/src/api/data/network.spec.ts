import { describe, it, vi } from 'vitest';

import { v6 } from '@ovh-ux/manager-core-api';

import {
  getAllPrivateNetworks,
  getAllPrivateNetworksByRegion,
  getPrivateNetworkName,
} from '@/api/data/network';

describe('getAllPrivateNetworks', () => {
  it('fetches all private networks successfully', async () => {
    const mockData = [
      {
        id: 'network1',
        name: 'Private Network 1',
        vlanId: 100,
        type: 'private',
        status: 'active',
        regions: [{ region: 'region1', status: 'active', openstackId: 'os1' }],
      },
    ];
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getAllPrivateNetworks('project1');
    expect(result).toEqual(mockData);
  });

  it('handles empty private networks response', async () => {
    const mockData = [];
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getAllPrivateNetworks('project1');
    expect(result).toEqual(mockData);
  });

  it('handles error when fetching private networks', async () => {
    vi.mocked(v6.get).mockRejectedValue(new Error('Network Error'));
    await expect(getAllPrivateNetworks('project1')).rejects.toThrow('Network Error');
  });
});

describe('getPrivateNetworkName', () => {
  it('returns network name when private network ID is found', () => {
    const privateNetworks = [
      {
        id: 'network1',
        name: 'Private Network 1',
        vlanId: 100,
        type: 'private',
        status: 'active',
        regions: [{ region: 'region1', status: 'active', openstackId: 'os1' }],
      },
    ];
    const result = getPrivateNetworkName(privateNetworks, 'os1');
    expect(result).toBe('Private Network 1');
  });

  it('returns private network ID when ID is not found', () => {
    const privateNetworks = [
      {
        id: 'network1',
        name: 'Private Network 1',
        vlanId: 100,
        type: 'private',
        status: 'active',
        regions: [{ region: 'region1', status: 'active', openstackId: 'os1' }],
      },
    ];
    const result = getPrivateNetworkName(privateNetworks, 'os2');
    expect(result).toBe('os2');
  });

  it('returns private network ID when ID is empty', () => {
    const privateNetworks = [
      {
        id: 'network1',
        name: 'Private Network 1',
        vlanId: 100,
        type: 'private',
        status: 'active',
        regions: [{ region: 'region1', status: 'active', openstackId: 'os1' }],
      },
    ];
    const result = getPrivateNetworkName(privateNetworks, '');
    expect(result).toBe('');
  });
});

describe('getAllPrivateNetworksByRegion', () => {
  it('fetches all private networks for a specific region successfully', async () => {
    const mockData = [
      {
        id: '1',
        name: 'test_3AZ_with_Gateway',
        visibility: 'private',
        vlanId: 371,
      },
      {
        id: '2',
        name: 'Ext-Net',
        visibility: 'public',
        vlanId: null,
      },
      {
        id: '3',
        name: 'test_3AZ',
        visibility: 'private',
        vlanId: 3750,
      },
      {
        id: '4',
        name: 'Ext-Net-v6',
        visibility: 'public',
        vlanId: null,
      },
    ];

    vi.mocked(v6.get).mockResolvedValue({ data: mockData });

    const result = await getAllPrivateNetworksByRegion('project1', 'region1');
    expect(result).toEqual(mockData);
  });

  it('handles empty response for specific region', async () => {
    vi.mocked(v6.get).mockResolvedValue({ data: [] });

    const result = await getAllPrivateNetworksByRegion('project1', 'region2');
    expect(result).toEqual([]);
  });

  it('throws error when API call fails', async () => {
    vi.mocked(v6.get).mockRejectedValue(new Error('API Error'));

    await expect(getAllPrivateNetworksByRegion('project1', 'region1')).rejects.toThrow('API Error');
  });
});
