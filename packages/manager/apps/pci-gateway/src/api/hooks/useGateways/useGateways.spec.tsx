import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import {
  getCatalogQuery,
  getProductAvailabilityQuery,
} from '@ovh-ux/manager-pci-common';
import { useQueryWrapper } from '@/__tests__/wrapper';
import { availableProducts, catalog, regions } from '@/__mocks__/addons';
import { useGatewayHourlyAddons, useRegionGatewayAddons } from './useGateways';

vi.mock('@ovh-ux/manager-pci-common');

vi.mocked(getCatalogQuery).mockReturnValue({
  queryKey: ['catalog'],
  queryFn: vi.fn().mockResolvedValue(catalog),
});

vi.mocked(getProductAvailabilityQuery).mockReturnValue({
  queryKey: ['availableProducts'],
  queryFn: vi.fn().mockResolvedValue(availableProducts),
});

describe('useGatewayHourlyAddons', () => {
  it('should return the project regions with hourly addons', async () => {
    const { result } = renderHook(
      () => useGatewayHourlyAddons('FR', 'projectId-test'),
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
              bandwidth: {
                level: 1000,
              },
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
              bandwidth: {
                level: 500,
              },
            },
          },
          regions,
        },
      ]),
    );
  });
});

describe('useRegionGatewayAddons', () => {
  it('should return the region addons', async () => {
    const { result } = renderHook(
      () => useRegionGatewayAddons('FR', 'projectId-test', 'GRA-STAGING-A'),
      {
        wrapper: useQueryWrapper,
      },
    );

    await waitFor(() =>
      expect(result.current).toEqual([
        {
          size: 's',
          price: 50,
          bandwidth: 500,
        },
        {
          size: 'l',
          price: 100,
          bandwidth: 1000,
        },
      ]),
    );
  });
});
