import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  getPrivateNetworkByRegion,
  getSubnetByNetworkAndRegion,
  TNetwork,
  TSubnet,
} from './network';

describe('API Data Network', () => {
  describe('getPrivateNetworkByRegion', () => {
    it('should return network data for a given project, region, and network ID', async () => {
      const mockNetwork: TNetwork = {
        id: 'network-id',
        name: 'network-name',
        visibility: 'private',
        vlanId: 123,
      };

      vi.mocked(v6.get).mockResolvedValue({ data: mockNetwork });

      const result = await getPrivateNetworkByRegion(
        'project-id',
        'region',
        'network-id',
      );
      expect(result).toEqual(mockNetwork);
      expect(v6.get).toHaveBeenCalledWith(
        '/cloud/project/project-id/region/region/network/network-id',
      );
    });

    it('should throw an error if the API call fails', async () => {
      vi.mocked(v6.get).mockRejectedValue(new Error('API Error'));

      await expect(
        getPrivateNetworkByRegion('project-id', 'region', 'network-id'),
      ).rejects.toThrow('API Error');
    });
  });

  describe('getSubnetByNetworkAndRegion', () => {
    it('should return subnet data for a given project, region, network ID, and subnet ID', async () => {
      const mockSubnet: TSubnet = {
        cidr: '192.168.1.0/24',
        gatewayIp: '192.168.1.1',
        id: 'subnet-id',
      };

      vi.mocked(v6.get).mockResolvedValue({ data: mockSubnet });

      const result = await getSubnetByNetworkAndRegion(
        'project-id',
        'region',
        'network-id',
        'subnet-id',
      );
      expect(result).toEqual(mockSubnet);
      expect(v6.get).toHaveBeenCalledWith(
        '/cloud/project/project-id/region/region/network/network-id/subnet/subnet-id',
      );
    });

    it('should throw an error if the API call fails', async () => {
      vi.mocked(v6.get).mockRejectedValue(new Error('API Error'));

      await expect(
        getSubnetByNetworkAndRegion(
          'project-id',
          'region',
          'network-id',
          'subnet-id',
        ),
      ).rejects.toThrow('API Error');
    });
  });
});
