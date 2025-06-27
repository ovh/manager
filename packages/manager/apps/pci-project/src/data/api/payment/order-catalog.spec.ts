import { describe, it, expect, vi, beforeEach } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getOrderCatalog, TOrderCatalogParams } from './order-catalog';
import { TOrderCatalog } from '@/data/types/payment/order-catalog.type';

// Mock the API module
vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi.fn(),
  },
}));

describe('order-catalog API', () => {
  const mockV6Get = vi.mocked(v6.get);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getOrderCatalog', () => {
    const mockOrderCatalog: TOrderCatalog = {
      plans: [
        {
          planCode: 'test-plan',
          invoiceName: 'Test Plan',
          product: 'cloud',
          pricingType: 'purchase',
          family: 'test-family',
          addonFamilies: [],
          configurations: [],
          consumptionConfiguration: null,
          pricings: [
            {
              capacities: ['installation'],
              commitment: 1,
              description: 'Test pricing',
              engagementConfiguration: null,
              interval: 1,
              intervalUnit: 'month',
              mode: 'default',
              mustBeCompleted: false,
              phase: 0,
              price: 1000000, // 10 EUR in micro cents
              promotions: [],
              quantity: { min: 1, max: null },
              repeat: { min: 1, max: null },
              strategy: 'volume',
              tax: 200000, // 2 EUR tax in micro cents
              type: 'purchase',
            },
          ],
        },
      ],
    };

    it('should call API with correct endpoint and parameters', async () => {
      const params: TOrderCatalogParams = {
        ovhSubsidiary: 'FR',
      };

      mockV6Get.mockResolvedValue({ data: mockOrderCatalog });

      const result = await getOrderCatalog(params);

      expect(mockV6Get).toHaveBeenCalledWith('/order/catalog/public/cloud', {
        params,
      });
      expect(result).toEqual(mockOrderCatalog);
    });

    it('should call API without parameters when none provided', async () => {
      mockV6Get.mockResolvedValue({ data: mockOrderCatalog });

      const result = await getOrderCatalog();

      expect(mockV6Get).toHaveBeenCalledWith('/order/catalog/public/cloud', {
        params: undefined,
      });
      expect(result).toEqual(mockOrderCatalog);
    });

    it('should handle API errors', async () => {
      const params: TOrderCatalogParams = {
        ovhSubsidiary: 'FR',
      };

      const mockError = new Error('API Error');
      mockV6Get.mockRejectedValue(mockError);

      await expect(getOrderCatalog(params)).rejects.toThrow('API Error');
      expect(mockV6Get).toHaveBeenCalledWith('/order/catalog/public/cloud', {
        params,
      });
    });

    it('should handle empty catalog response', async () => {
      const emptyOrderCatalog: TOrderCatalog = {
        plans: [],
      };

      mockV6Get.mockResolvedValue({ data: emptyOrderCatalog });

      const result = await getOrderCatalog({ ovhSubsidiary: 'US' });

      expect(result?.plans).toEqual([]);
    });
  });
});
