import { describe, expect, it, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getCatalog } from './catalog';

describe('getCatalog', () => {
  it('returns catalog data successfully', async () => {
    const mockData = {
      catalogId: 'catalog1',
      locale: {
        currencyCode: 'USD',
        subsidiary: 'US',
        taxRate: 0.1,
      },
      plans: [
        {
          planCode: 'plan1',
          invoiceName: 'Plan 1',
          product: 'Product 1',
          pricingType: 'fixed',
          consumptionConfiguration: 'config1',
          pricings: [
            {
              capacities: ['capacity1'],
              mode: 'mode1',
              phase: 1,
              commitment: 12,
              description: 'Description 1',
              price: {
                currencyCode: 'USD',
                text: '$10',
                value: 10,
              },
              tax: 1,
              interval: 1,
              intervalUnit: 'month',
              quantity: {
                max: 10,
                min: 1,
              },
              repeat: {
                max: 12,
                min: 1,
              },
              strategy: 'strategy1',
              mustBeCompleted: true,
              type: 'type1',
              promotions: [],
            },
          ],
          addonFamilies: [
            {
              addons: ['addon1'],
              name: 'Addon Family 1',
              exclusive: true,
              mandatory: false,
            },
          ],
        },
      ],
      addons: [
        {
          planCode: 'addon1',
          blobs: {
            tags: ['tag1'],
            technical: {
              name: 'Technical 1',
            },
          },
          pricings: [
            {
              price: 5,
              type: 'type1',
              capacities: ['capacity1'],
            },
          ],
        },
      ],
    };
    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockData });
    const result = await getCatalog('US');
    expect(result).toEqual(mockData);
  });

  it('throws an error when API call fails', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(v6.get).mockRejectedValueOnce(new Error(errorMessage));
    await expect(getCatalog('US')).rejects.toThrow(errorMessage);
  });

  it('returns empty catalog when no plans or addons are available', async () => {
    const mockData = {
      catalogId: 'catalog1',
      locale: {
        currencyCode: 'USD',
        subsidiary: 'US',
        taxRate: 0.1,
      },
      plans: [],
      addons: [],
    };
    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockData });
    const result = await getCatalog('US');
    expect(result).toEqual(mockData);
  });
});
