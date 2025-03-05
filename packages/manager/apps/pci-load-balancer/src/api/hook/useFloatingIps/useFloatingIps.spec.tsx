import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { useRegionAddons } from '@/api/hook/useAddons/useAddons';
import { useFloatingIps, useRegionFloatingIpAddons } from './useFloatingIps';
import { useQueryWrapper } from '@/__tests__/wrapper';
import { FLOATING_IP_ADDON_FAMILY } from './useFloatingIps.constant';
import { getFloatingIps } from '@/api/data/floating-ips';
import { floatingIps } from '@/__mocks__/floatingIps';

vi.mock('@/api/data/floating-ips');

vi.mocked(getFloatingIps).mockResolvedValue(floatingIps);

vi.mock('@/api/hook/useAddons/useAddons');

describe('useFloatingIps', () => {
  it('should return floating ips for the region', async () => {
    const { result } = renderHook(
      () => useFloatingIps('projectId', 'projectId-test'),
      {
        wrapper: useQueryWrapper,
      },
    );

    await waitFor(() =>
      expect(result.current.data).toEqual([
        {
          id: 'floating-id2',
          ip: 'test-ip2',
          networkId: 'network-id2',
          status: 'active',
          associatedEntity: null,
        },
      ]),
    );
  });
});

describe('useRegionFloatingIpAddons', () => {
  it('should call useRegionAddons with floatingip addon family', async () => {
    renderHook(
      () => useRegionFloatingIpAddons('FR', 'projectId-test', 'GRA-STAGING-A'),
      {
        wrapper: useQueryWrapper,
      },
    );

    expect(useRegionAddons).toHaveBeenCalledWith(
      'FR',
      'projectId-test',
      'GRA-STAGING-A',
      FLOATING_IP_ADDON_FAMILY,
    );
  });
});
