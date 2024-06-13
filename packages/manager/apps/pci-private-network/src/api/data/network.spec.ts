import { describe, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  associateGatewayToNetworkCall,
  checkPrivateNetworkCreationStatus,
  createNetwork,
  createNetworkCall,
  deleteNetwork,
  enableSnatOnGatewayCall,
  getAggregatedNetwork,
  getCreatedSubnet,
} from './network';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi.fn(),
    delete: vi.fn(),
    post: vi.fn(),
  },
}));

describe('Network API', () => {
  it('should get aggregated network successfully', async () => {
    const mockData = { resources: [] };
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });

    const result = await getAggregatedNetwork('mocked_projectId');
    expect(result).toEqual(mockData.resources);
    expect(vi.mocked(v6.get)).toHaveBeenCalledWith(
      '/cloud/project/mocked_projectId/aggregated/network',
    );
  });

  it('should delete the network successfully', async () => {
    const mockData = { status: 'deleted' };
    vi.mocked(v6.delete).mockResolvedValue({ data: mockData });

    const result = await deleteNetwork(
      'mocked_projectId',
      'mocked_region',
      'mocked_networkId',
    );
    expect(result).toEqual(mockData);
    expect(vi.mocked(v6.delete)).toHaveBeenCalledWith(
      '/cloud/project/mocked_projectId/region/mocked_region/network/mocked_networkId',
    );
  });

  it('should associate gateway to network successfully', async () => {
    const mockData = { status: 'associated' };
    vi.mocked(v6.post).mockResolvedValue({ data: mockData });

    const result = await associateGatewayToNetworkCall(
      'mocked_projectId',
      'mocked_region',
      'mocked_gatewayId',
      'mocked_subnetId',
    );
    expect(result).toEqual(mockData);
    expect(
      vi.mocked(v6.post),
    ).toHaveBeenCalledWith(
      '/cloud/project/mocked_projectId/region/mocked_region/gateway/mocked_gatewayId/interface',
      { subnetId: 'mocked_subnetId' },
    );
  });

  it('should enable SNAT on gateway successfully', async () => {
    const mockData = { status: 'enabled' };
    vi.mocked(v6.post).mockResolvedValue({ data: mockData });

    const result = await enableSnatOnGatewayCall(
      'mocked_projectId',
      'mocked_region',
      'mocked_gatewayId',
    );
    expect(result).toEqual(mockData);
    expect(vi.mocked(v6.post)).toHaveBeenCalledWith(
      '/cloud/project/mocked_projectId/region/mocked_region/gateway/mocked_gatewayId/expose',
    );
  });

  it('should get created subnet successfully', async () => {
    const mockData = { status: 'created' };
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });

    const result = await getCreatedSubnet(
      'mocked_projectId',
      'mocked_region',
      'mocked_networkId',
    );
    expect(result).toEqual(mockData);
    expect(vi.mocked(v6.get)).toHaveBeenCalledWith(
      '/cloud/project/mocked_projectId/region/mocked_region/network/mocked_networkId/subnet',
    );
  });

  it('should check private network creation status successfully', async () => {
    const mockData = { status: 'created' };
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });

    const result = await checkPrivateNetworkCreationStatus(
      'mocked_projectId',
      'mocked_operationId',
    );
    expect(result).toEqual(mockData);
    expect(vi.mocked(v6.get)).toHaveBeenCalledWith(
      '/cloud/project/mocked_projectId/operation/mocked_operationId',
    );
  });

  it('should create network call successfully', async () => {
    const mockData = { status: 'created' };
    vi.mocked(v6.post).mockResolvedValue({ data: mockData });

    const result = await createNetworkCall(
      'mocked_projectId',
      'mocked_region',
      'mocked_privateNetworkName',
      {},
      {},
      1,
    );
    expect(result).toEqual(mockData);
    expect(vi.mocked(v6.post)).toHaveBeenCalledWith(
      '/cloud/project/mocked_projectId/region/mocked_region/network',
      {
        name: 'mocked_privateNetworkName',
        subnet: {},
        gateway: {},
        vlanId: 1,
      },
    );
  });

  it('should throw an error when network creation fails', async () => {
    const mockError = new Error('Network creation failed');
    vi.mocked(v6.post).mockRejectedValue(mockError);

    await expect(
      createNetwork({
        projectId: 'mocked_projectId',
        region: 'mocked_region',
        privateNetworkName: 'mocked_privateNetworkName',
        subnet: {
          cidr: 'mocked_cidr',
          ipVersion: 4,
          enableDhcp: true,
          enableGatewayIp: true,
        },
        vlanId: 1,
        gateway: {
          gatewayName: 'mocked_gatewayName',
          gatewaySize: 'mocked_gatewaySize',
        },
      }),
    ).rejects.toThrow(mockError);
    expect(vi.mocked(v6.post)).toHaveBeenCalledWith(
      '/cloud/project/mocked_projectId/region/mocked_region/network',
      {
        name: 'mocked_privateNetworkName',
        subnet: {
          cidr: 'mocked_cidr',
          ipVersion: 4,
          enableDhcp: true,
          enableGatewayIp: true,
        },
        gateway: {
          gatewayName: 'mocked_gatewayName',
          gatewaySize: 'mocked_gatewaySize',
        },
        vlanId: 1,
      },
    );
  });
});
