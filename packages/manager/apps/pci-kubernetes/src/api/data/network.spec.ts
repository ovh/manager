import { v6 } from '@ovh-ux/manager-core-api';
import { describe, it, vi } from 'vitest';
import {
  getAllPrivateNetworks,
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
    await expect(getAllPrivateNetworks('project1')).rejects.toThrow(
      'Network Error',
    );
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
