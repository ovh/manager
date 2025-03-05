import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { useAddons, useRegionAddons } from '@/api/hook/useAddons/useAddons';
import { useQueryWrapper } from '@/__tests__/wrapper';
import { defaultAddons } from '@/__mocks__/addons';
import {
  useRegionGatewayAddons,
  useSmallestGatewayRegion,
} from './useGateways';
import { RegionAddon } from '@/types/addon.type';
import { GATEWAY_ADDON_FAMILY } from './useGateways.constant';

vi.mock('@/api/hook/useAddons/useAddons');

vi.mocked(useAddons).mockReturnValue({
  addons: (defaultAddons as unknown) as RegionAddon[],
  isFetching: false,
});

describe('useRegionGatewayAddons', () => {
  it('should call useRegionAddons with gateway addon family', async () => {
    renderHook(
      () => useRegionGatewayAddons('FR', 'projectId-test', 'GRA-STAGING-A'),
      {
        wrapper: useQueryWrapper,
      },
    );

    expect(useRegionAddons).toHaveBeenCalledWith(
      'FR',
      'projectId-test',
      'GRA-STAGING-A',
      GATEWAY_ADDON_FAMILY,
    );
  });
});

describe('useSmallestGatewayRegion', () => {
  it('should return the smallest gateway in the region', async () => {
    vi.mocked(useRegionAddons).mockReturnValue({
      addons: [
        {
          size: 's',
          price: 50,
          technicalName: 'small',
        },
        {
          size: 'l',
          price: 100,
          technicalName: 'large',
        },
      ],
      isFetching: false,
    });

    const { result } = renderHook(
      () => useSmallestGatewayRegion('FR', 'projectId-test', 'GRA-STAGING-A'),
      {
        wrapper: useQueryWrapper,
      },
    );

    await waitFor(() =>
      expect(result.current).toEqual({
        size: 's',
        price: 50,
        technicalName: 'small',
      }),
    );
  });
});
