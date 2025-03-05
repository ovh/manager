import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { useQueryWrapper } from '@/__tests__/wrapper';
import { defaultAddons } from '@/__mocks__/addons';
import { RegionAddon } from '@/types/addon.type';
import {
  useLoadBalancerAddons,
  useRegionLoadBalancerAddons,
} from './useLoadBalancer';
import { useAddons } from '@/api/hook/useAddons/useAddons';

vi.mock('@/api/hook/useAddons/useAddons');

const addons = (defaultAddons as unknown) as RegionAddon[];

vi.mocked(useAddons).mockReturnValue({
  addons,
  isFetching: false,
});

describe('useLoadBalancerAddons', () => {
  it('should return the project addons with only hourly price', async () => {
    const { result } = renderHook(
      () => useLoadBalancerAddons('FR', 'projectId-test'),
      {
        wrapper: useQueryWrapper,
      },
    );

    await waitFor(() => expect(result.current.addons).toEqual(defaultAddons));
  });
});

describe('useRegionLoadBalancerAddons', () => {
  it('should return the region addons', async () => {
    const { result } = renderHook(
      () => useRegionLoadBalancerAddons(addons, 'GRA-STAGING-A'),
      {
        wrapper: useQueryWrapper,
      },
    );

    await waitFor(() =>
      expect(result.current).toEqual([
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
      ]),
    );
  });
});
