import { describe, it, expect } from 'vitest';
import { mockedPrivateNetworkEntity } from '@/__mocks__/instance/constants';
import {
  selectPrivateNetworks,
  selectOvhPrivateNetwork,
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

  it('should return subnet in the same region', () => {
    const result = selectPrivateNetworks('BHS5')(mockedPrivateNetworkEntity);
    expect(result).toEqual([
      {
        label: 'test-network-1',
        value: '22defd89-ab74-4353-8676-6a0ad7a239d3',
        customRendererData: {
          networkId: '46d3947f-1098-40a2-be0c-36603b2ab4c3',
          hasGateway: true,
          capabilities: ['FloatingIP'],
        },
      },
    ]);
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
