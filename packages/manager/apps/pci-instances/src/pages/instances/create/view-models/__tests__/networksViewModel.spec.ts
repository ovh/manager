import { describe, it, expect } from 'vitest';
import {
  mockedPrivateNetworkEntity,
  mockedPrivateNetworkEntityWithMetal,
} from '@/__mocks__/instance/constants';
import {
  applyMetalConstraints,
  findFirstVlan0Network,
  isMetalCategory,
  METAL_FLAVOR_CATEGORY,
  selectPrivateNetworks,
  selectOvhPrivateNetwork,
  TPrivateNetworkData,
} from '../networksViewModel';

describe('selectPrivateNetworks ViewModel', () => {
  it('should return empty array when privateNetworks is undefined', () => {
    const result = selectPrivateNetworks('BHS5')();
    expect(result).toEqual([]);
  });

  it('should return empty array when region is null', () => {
    const result = selectPrivateNetworks(null)(mockedPrivateNetworkEntity);
    expect(result).toEqual([]);
  });

  it('should return empty array when no networks match the region', () => {
    const result = selectPrivateNetworks('NONEXISTENT')(
      mockedPrivateNetworkEntity,
    );
    expect(result).toEqual([]);
  });

  it('should return subnets in the same region with vlanId', () => {
    const result = selectPrivateNetworks('BHS5')(mockedPrivateNetworkEntity);
    expect(result).toEqual([
      {
        label: 'test-network-1',
        value: '22defd89-ab74-4353-8676-6a0ad7a239d3',
        customRendererData: {
          networkId: '46d3947f-1098-40a2-be0c-36603b2ab4c3',
          hasGateway: true,
          capabilities: ['FloatingIP'],
          vlanId: 2100,
        },
      },
    ]);
  });

  it('should return subnets including vlan0 metal network', () => {
    const result = selectPrivateNetworks('BHS5')(
      mockedPrivateNetworkEntityWithMetal,
    );
    expect(result).toHaveLength(2);
    expect(result[1]).toEqual({
      label: 'test-network-metal',
      value: 'metal-subnet-vlan0',
      customRendererData: {
        networkId: 'metal-network-vlan0',
        hasGateway: false,
        capabilities: ['FloatingIP'],
        vlanId: 0,
      },
    });
  });
});

describe('selectOvhPrivateNetwork ViewModel', () => {
  it('should return null when region is null', () => {
    const result = selectOvhPrivateNetwork(null)(mockedPrivateNetworkEntity);
    expect(result).toBeNull();
  });

  it('should return null when privateNetworks is undefined', () => {
    const result = selectOvhPrivateNetwork('BHS5')();
    expect(result).toBeNull();
  });

  it('should return correct structure with allocatedVlanIds and ovhPrivateNetwork for valid inputs', () => {
    const result = selectOvhPrivateNetwork('BHS5')(mockedPrivateNetworkEntity);

    expect(result).not.toBeNull();
    expect(result).toHaveProperty('ovhPrivateNetwork');
    expect(result).toHaveProperty('allocatedVlanIds');

    if (!result) return;

    expect(result.allocatedVlanIds).toEqual([2100, 2800]);

    expect(result.ovhPrivateNetwork.name).toMatch(/^pn-BHS5-\d{8}$/);
    expect(result.ovhPrivateNetwork.vlanId).toBeGreaterThan(0);
    expect(result.ovhPrivateNetwork.cidr).toMatch(/^10\.\d{1,3}\.0\.0\/16$/);
    expect(result.ovhPrivateNetwork.enableDhcp).toBe(true);
  });
});

describe('isMetalCategory', () => {
  it('should return true for Metal Instances category', () => {
    expect(isMetalCategory(METAL_FLAVOR_CATEGORY)).toBe(true);
  });

  it('should return false for other categories', () => {
    expect(isMetalCategory('General Purpose')).toBe(false);
    expect(isMetalCategory(null)).toBe(false);
  });
});

describe('applyMetalConstraints', () => {
  const networks: TPrivateNetworkData[] = [
    {
      label: 'net-vlan-100',
      value: 'subnet-1',
      customRendererData: {
        networkId: 'n1',
        hasGateway: false,
        capabilities: [],
        vlanId: 100,
      },
    },
    {
      label: 'net-vlan-0',
      value: 'subnet-2',
      customRendererData: {
        networkId: 'n2',
        hasGateway: false,
        capabilities: [],
        vlanId: 0,
      },
    },
  ];

  it('should disable networks with vlanId !== 0', () => {
    const result = applyMetalConstraints(networks);
    expect(result[0]!.disabled).toBe(true);
    expect(result[1]!.disabled).toBe(false);
  });
});

describe('findFirstVlan0Network', () => {
  const networks: TPrivateNetworkData[] = [
    {
      label: 'net-vlan-100',
      value: 'subnet-1',
      customRendererData: {
        networkId: 'n1',
        hasGateway: false,
        capabilities: [],
        vlanId: 100,
      },
    },
    {
      label: 'net-vlan-0',
      value: 'subnet-2',
      customRendererData: {
        networkId: 'n2',
        hasGateway: false,
        capabilities: [],
        vlanId: 0,
      },
    },
  ];

  it('should return the first network with vlanId === 0', () => {
    const result = findFirstVlan0Network(networks);
    expect(result?.value).toBe('subnet-2');
  });

  it('should return undefined when no vlan0 network exists', () => {
    const result = findFirstVlan0Network([networks[0]!]);
    expect(result).toBeUndefined();
  });
});
