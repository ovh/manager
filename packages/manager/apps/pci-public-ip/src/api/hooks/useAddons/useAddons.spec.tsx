import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import {
  getCatalogQuery,
  getProductAvailabilityQuery,
} from '@ovh-ux/manager-pci-common';
import { useAddons } from './useAddons';
import { useQueryWrapper } from '@/__tests__/wrapper';
import { availableProducts, catalog, regions } from '@/__mocks__/addons';
import {
  sortProductByPrice,
  filterProductRegionBySize,
} from './useAddons.select';

vi.mock('@ovh-ux/manager-pci-common');

vi.mocked(getCatalogQuery).mockReturnValue({
  queryKey: ['catalog'],
  queryFn: vi.fn().mockResolvedValue(catalog),
});

vi.mocked(getProductAvailabilityQuery).mockReturnValue({
  queryKey: ['availableProducts'],
  queryFn: vi.fn().mockResolvedValue(availableProducts),
});

describe('useAddons', () => {
  it('should return the project hourly addons with available regions', async () => {
    const { result } = renderHook(
      () =>
        useAddons({
          ovhSubsidiary: 'FR',
          projectId: 'projectId-test',
          addonFamily: 'testAddon',
        }),
      { wrapper: useQueryWrapper },
    );

    await waitFor(() =>
      expect(result.current.addons).toEqual([
        {
          size: 'l',
          price: 100,
          technicalName: 'large',
          regions,
        },
        {
          size: 's',
          price: 50,
          technicalName: 'small',
          regions,
        },
      ]),
    );
  });

  it('should return the project hourly addons with available regions order by price', async () => {
    const { result } = renderHook(
      () =>
        useAddons({
          ovhSubsidiary: 'FR',
          projectId: 'projectId-test',
          addonFamily: 'testAddon',
          select: sortProductByPrice,
        }),
      { wrapper: useQueryWrapper },
    );

    await waitFor(() =>
      expect(result.current.addons).toEqual([
        {
          size: 's',
          price: 50,
          technicalName: 'small',
          regions,
        },
        {
          size: 'l',
          price: 100,
          technicalName: 'large',
          regions,
        },
      ]),
    );
  });

  it('should return empty when filter product by uknown region', async () => {
    const { result } = renderHook(
      () =>
        useAddons({
          ovhSubsidiary: 'FR',
          projectId: 'projectId-test',
          addonFamily: 'testAddon',
          select: (addons) =>
            filterProductRegionBySize(addons, 'REGION-uknown'),
        }),
      { wrapper: useQueryWrapper },
    );

    await waitFor(() => expect(result.current.addons).toEqual([]));
  });
});
