import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IntervalUnit } from '@ovh-ux/muk';

import {
  SECRET_PRICE,
  SECRET_TAX,
  SERVICE_KEY_PRICE,
  SERVICE_KEY_TAX,
  catalogMock,
} from '@/common/mocks/catalog/catalog.mock';
import { OkmsCatalog } from '@/common/types/orderCatalogOkms.type';
import { renderHookWithClient } from '@/common/utils/tests/testUtils';

import { useOkmsPricing } from './useOkmsPricing';

// Mock the useOrderCatalogOkms hook
const mockUseOrderCatalogOkms = vi.fn();
vi.mock('@/common/data/hooks/useOrderCatalogOkms', () => ({
  useOrderCatalogOkms: (): unknown => mockUseOrderCatalogOkms(),
}));

describe('useOkmsPricing', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation - success state
    mockUseOrderCatalogOkms.mockReturnValue({
      data: catalogMock,
      isPending: false,
      isError: false,
    });
  });

  describe('when data is loading', () => {
    it('should return loading state when catalog is pending', () => {
      mockUseOrderCatalogOkms.mockReturnValue({
        data: null,
        isPending: true,
        isError: false,
      });

      const { result } = renderHookWithClient(() => useOkmsPricing({ productCode: 'servicekey' }));

      expect(result.current).toEqual({
        isPending: true,
        isError: false,
        pricingData: undefined,
      });
    });
  });

  describe('when there are errors', () => {
    it('should return error state when catalog fetch fails', () => {
      mockUseOrderCatalogOkms.mockReturnValue({
        data: null,
        isPending: false,
        isError: true,
      });

      const { result } = renderHookWithClient(() => useOkmsPricing({ productCode: 'servicekey' }));

      expect(result.current).toEqual({
        isPending: false,
        isError: true,
        pricingData: undefined,
      });
    });

    it('should return error state when catalog is null', () => {
      mockUseOrderCatalogOkms.mockReturnValue({
        data: null,
        isPending: false,
        isError: false,
      });

      const { result } = renderHookWithClient(() => useOkmsPricing({ productCode: 'servicekey' }));

      expect(result.current).toEqual({
        isPending: false,
        isError: true,
        pricingData: undefined,
      });
    });

    it('should return error state when addon is not found for product code', () => {
      const catalogWithoutAddon: OkmsCatalog = {
        ...catalogMock,
        addons: [],
      };

      mockUseOrderCatalogOkms.mockReturnValue({
        data: catalogWithoutAddon,
        isPending: false,
        isError: false,
      });

      const { result } = renderHookWithClient(() => useOkmsPricing({ productCode: 'servicekey' }));

      expect(result.current).toEqual({
        isPending: false,
        isError: true,
        pricingData: undefined,
      });
    });

    it('should return error state when plan is not found', () => {
      const catalogWithoutPlan: OkmsCatalog = {
        ...catalogMock,
        plans: [],
      };

      mockUseOrderCatalogOkms.mockReturnValue({
        data: catalogWithoutPlan,
        isPending: false,
        isError: false,
      });

      const { result } = renderHookWithClient(() => useOkmsPricing({ productCode: 'servicekey' }));

      expect(result.current).toEqual({
        isPending: false,
        isError: true,
        pricingData: undefined,
      });
    });

    it('should return error state when addon has no pricings array', () => {
      const catalogWithInvalidAddon: OkmsCatalog = {
        ...catalogMock,
        addons: [
          {
            planCode: 'okms-servicekey-monthly-consumption',
            invoiceName: 'OKMS Service Key',
            product: 'okms',
            pricingType: 'consumption',
            pricings: [],
          },
          ...catalogMock.addons.slice(1),
        ],
      };

      mockUseOrderCatalogOkms.mockReturnValue({
        data: catalogWithInvalidAddon,
        isPending: false,
        isError: false,
      });

      const { result } = renderHookWithClient(() => useOkmsPricing({ productCode: 'servicekey' }));

      expect(result.current).toEqual({
        isPending: false,
        isError: true,
        pricingData: undefined,
      });
    });

    it('should return error state when plan has no pricings array', () => {
      const catalogWithInvalidPlan: OkmsCatalog = {
        ...catalogMock,
        plans: [
          {
            planCode: 'okms',
            configurations: [],
            pricings: [],
          },
        ],
      };

      mockUseOrderCatalogOkms.mockReturnValue({
        data: catalogWithInvalidPlan,
        isPending: false,
        isError: false,
      });

      const { result } = renderHookWithClient(() => useOkmsPricing({ productCode: 'servicekey' }));

      expect(result.current).toEqual({
        isPending: false,
        isError: true,
        pricingData: undefined,
      });
    });
  });

  describe('when data is loaded successfully', () => {
    it('should return pricing data for servicekey product code', () => {
      const { result } = renderHookWithClient(() => useOkmsPricing({ productCode: 'servicekey' }));

      expect(result.current).toEqual({
        isPending: false,
        isError: false,
        pricingData: {
          price: SERVICE_KEY_PRICE,
          tax: SERVICE_KEY_TAX,
          intervalUnit: IntervalUnit.month,
        },
      });
    });

    it('should return pricing data for secret product code', () => {
      const { result } = renderHookWithClient(() => useOkmsPricing({ productCode: 'secret' }));

      expect(result.current).toEqual({
        isPending: false,
        isError: false,
        pricingData: {
          price: SECRET_PRICE,
          tax: SECRET_TAX,
          intervalUnit: IntervalUnit.month,
        },
      });
    });
  });
});
