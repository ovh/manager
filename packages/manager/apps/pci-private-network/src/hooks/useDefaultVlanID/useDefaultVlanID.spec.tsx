import { describe, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import useDefaultVlanID from './useDefaultVlanID';

const { usePrivateNetworks, networks } = vi.hoisted(() => ({
  usePrivateNetworks: vi.fn(),
  networks: [
    {
      id: '123',
      name: 'network1',
      region: 'GRA11',
      visibility: 'private',
      vlanId: 1,
    },
    {
      id: '124',
      name: 'network2',
      region: 'RBX-1',
      visibility: 'private',
      vlanId: 3,
    },
  ],
}));

vi.mock('@ovh-ux/manager-pci-common', () => ({
  useProject: vi.fn().mockReturnValue({ data: {} }),
}));

vi.mock('@/data/hooks/networks/useNetworks', () => ({
  usePrivateNetworks,
}));

describe('useDefaultVlanID', () => {
  it('should return 1 as default vlanId and all ids are yet available when there is no private networks', () => {
    usePrivateNetworks.mockReturnValue({ data: [] });

    const { result } = renderHook(() => useDefaultVlanID());

    expect(result.current).toEqual({ defaultVlanId: 1, notAvailableIds: [] });
  });

  it('should return the smallest id not yet allocated and all not available ids', () => {
    usePrivateNetworks.mockReturnValue({ data: networks });

    const { result } = renderHook(() => useDefaultVlanID());

    expect(result.current).toEqual({
      defaultVlanId: 2,
      notAvailableIds: [1, 3],
    });
  });
});
