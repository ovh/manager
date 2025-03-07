import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import {
  getCatalogQuery,
  getProductAvailabilityQuery,
} from '@ovh-ux/manager-pci-common';
import { useAddons, useRegionAddons } from './useAddons';
import { useQueryWrapper } from '@/__tests__/wrapper';
import { availableProducts, catalog, regions } from '@/__mocks__/addons';

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
  it('should return the project regions with addons', async () => {
    const { result } = renderHook(
      () => useAddons('FR', 'projectId-test', 'testAddon'),
      { wrapper: useQueryWrapper },
    );

    await waitFor(() =>
      expect(result.current.addons).toEqual([
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
          planCode: 'pci-product.l-code-monthly',
          product: 'pci-product-l',
          pricings: [{ price: 3000, intervalUnit: 'monthly' }],
          blobs: {
            technical: {
              name: 'large',
            },
          },
          regions,
        },
        {
          planCode: 'pci-product.s-code-monthly',
          product: 'pci-product-s',
          pricings: [{ price: 100, intervalUnit: 'monthly' }],
          blobs: {
            technical: {
              name: 'small',
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
      ]),
    );
  });
});

describe('useRegionAddons', () => {
  it('should return the region addons', async () => {
    const { result } = renderHook(
      () =>
        useRegionAddons('FR', 'projectId-test', 'GRA-STAGING-A', 'testAddon'),
      {
        wrapper: useQueryWrapper,
      },
    );

    await waitFor(() =>
      expect(result.current.addons).toEqual([
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
