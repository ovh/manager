import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  getPrivateNetworkByRegion,
  getPrivateNetworks,
  getPrivateNetworkSubnets,
  getRegionPrivateNetworks,
  getSubnetByNetworkAndRegion,
  TNetwork,
  TPrivateNetwork,
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
      const mockSubnet = {
        cidr: '192.168.1.0/24',
        gatewayIp: '192.168.1.1',
        id: 'subnet-id',
      } as TSubnet;

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
  describe('getPrivateNetworks', () => {
    it('should return a list of private networks for a given project', async () => {
      const mockNetworks: TPrivateNetwork[] = [
        {
          id: 'network-id-1',
          name: 'network-name-1',
          status: 'ACTIVE',
          type: 'private',
          vlanId: 123,
          visibility: 'private',
          regions: [
            {
              openstackId: 'openstack-id-1',
              region: 'region-1',
              status: 'ACTIVE',
            },
          ],
        },
      ];

      vi.mocked(v6.get).mockResolvedValue({ data: mockNetworks });

      const result = await getPrivateNetworks('project-id');
      expect(result).toEqual(mockNetworks);
      expect(v6.get).toHaveBeenCalledWith(
        '/cloud/project/project-id/network/private',
      );
    });

    it('should throw an error if the API call fails', async () => {
      vi.mocked(v6.get).mockRejectedValue(new Error('API Error'));

      await expect(getPrivateNetworks('project-id')).rejects.toThrow(
        'API Error',
      );
    });
  });

  describe('getPrivateNetworkSubnets', () => {
    it('should return a list of subnets for a given project, region, and network ID', async () => {
      const mockSubnets: TSubnet[] = [
        {
          id: 'subnet-id-1',
          name: 'subnet-name-1',
          cidr: '192.168.1.0/24',
          ipVersion: 4,
          dhcpEnabled: true,
          gatewayIp: '192.168.1.1',
          allocationPools: [
            {
              start: '192.168.1.2',
              end: '192.168.1.254',
            },
          ],
          hostRoutes: [],
          dnsNameServers: ['8.8.8.8'],
        },
      ];

      vi.mocked(v6.get).mockResolvedValue({ data: mockSubnets });

      const result = await getPrivateNetworkSubnets(
        'project-id',
        'region',
        'network-id',
      );
      expect(result).toEqual(mockSubnets);
      expect(v6.get).toHaveBeenCalledWith(
        '/cloud/project/project-id/region/region/network/network-id/subnet',
      );
    });

    it('should throw an error if the API call fails', async () => {
      vi.mocked(v6.get).mockRejectedValue(new Error('API Error'));

      await expect(
        getPrivateNetworkSubnets('project-id', 'region', 'network-id'),
      ).rejects.toThrow('API Error');
    });
  });

  describe('getRegionPrivateNetworks', () => {
    it('should return a list of private networks for a given project and region', async () => {
      const mockNetworks: TPrivateNetwork[] = [
        {
          id: 'network-id-1',
          name: 'network-name-1',
          status: 'ACTIVE',
          type: 'private',
          vlanId: 123,
          visibility: 'private',
          regions: [
            {
              openstackId: 'openstack-id-1',
              region: 'region-1',
              status: 'ACTIVE',
            },
          ],
        },
      ];

      vi.mocked(v6.get).mockResolvedValue({ data: mockNetworks });

      const result = await getRegionPrivateNetworks('project-id', 'region');
      expect(result).toEqual(mockNetworks);
      expect(v6.get).toHaveBeenCalledWith(
        '/cloud/project/project-id/region/region/network',
      );
    });

    it('should throw an error if the API call fails', async () => {
      vi.mocked(v6.get).mockRejectedValue(new Error('API Error'));

      await expect(
        getRegionPrivateNetworks('project-id', 'region'),
      ).rejects.toThrow('API Error');
    });
  });
});
