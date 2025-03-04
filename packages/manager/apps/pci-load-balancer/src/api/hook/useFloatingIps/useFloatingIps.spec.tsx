import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { useAddons, useRegionAddons } from '@/api/hook/useAddons/useAddons';
import {
  useFloatingIps,
  useSelectFloatingIps,
  useRegionFloatingIpAddons,
} from './useFloatingIps';
import { useQueryWrapper } from '@/__tests__/wrapper';
import {
  FLOATING_IP_ADDON_FAMILY,
  FloatingIpSelectionId,
} from './useFloatingIps.constant';
import { getFloatingIps } from '@/api/data/floating-ips';
import { floatingIps } from '@/__mocks__/floatingIps';
import { regions } from '@/__mocks__/addons';
import { RegionAddon } from '@/types/addon.type';

vi.mock('@/api/data/floating-ips');

vi.mocked(getFloatingIps).mockResolvedValue(floatingIps);

vi.mock('@/api/hook/useAddons/useAddons');

vi.mocked(useAddons).mockReturnValue({
  addons: ([
    {
      planCode: 'pci-product.l-code-hour',
      product: 'pci-product-l',
      pricings: [{ price: 100, intervalUnit: 'hour' }],
      blobs: {
        technical: {
          name: 'large',
        },
      },
      regions,
    },
    {
      planCode: 'pci-product.s-code-hour',
      product: 'pci-product-s',
      pricings: [{ price: 50, intervalUnit: 'hour' }],
      blobs: {
        technical: {
          name: 'small',
        },
      },
      regions,
    },
  ] as unknown) as RegionAddon[],
  isFetching: false,
});

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

describe('useSelectFloatingIps', () => {
  it('should return floating ips, new public ip and no ip selection label', async () => {
    const { result } = renderHook(
      () => useSelectFloatingIps('projectId', 'projectId-test'),
      {
        wrapper: useQueryWrapper,
      },
    );

    await waitFor(() =>
      expect(result.current.floatingIps).toEqual([
        {
          id: FloatingIpSelectionId.NEW,
          label:
            'octavia_load_balancer_create_floating_ip_field_new_floating_ip',
        },
        {
          id: FloatingIpSelectionId.UNATTACHED,
          label:
            'octavia_load_balancer_create_floating_ip_field_no_floating_ip',
        },
        {
          id: 'floating-id2',
          label: 'test-ip2',
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
