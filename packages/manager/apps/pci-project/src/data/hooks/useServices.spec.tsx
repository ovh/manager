import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getCartServiceOption,
  getServiceId,
  getServiceOptions,
} from '@/data/api/services';
import { TCartServiceOption, TService } from '@/data/types/service.type';
import queryClient from '@/queryClient';
import { createWrapper } from '@/wrapperRenders';
import {
  useCartServiceOption,
  useServiceIds,
  useServiceOptions,
} from './useServices';

vi.mock('@/data/api/services', () => ({
  getCartServiceOption: vi.fn(),
  getServiceId: vi.fn(),
  getServiceOptions: vi.fn(),
}));

describe('useServices hooks', () => {
  const mockServiceIds = [1, 2, 3];
  const mockServiceOptions: TService[] = [
    {
      route: { url: '/url', path: '/path', vars: [{ key: 'k', value: 'v' }] },
      billing: {
        plan: { code: 'plan', invoiceName: 'Plan Invoice' },
        renew: null,
        pricing: {
          price: { text: '10.00 €', value: 10, currencyCode: 'EUR' },
          duration: 'P1M',
          interval: 1,
          capacities: [],
          description: 'desc',
          pricingMode: 'default',
          pricingType: 'purchase',
          maximumRepeat: null,
          minimumRepeat: 1,
          priceInUcents: 1000,
          maximumQuantity: 1,
          minimumQuantity: 1,
        },
        lifecycle: {
          current: {
            state: 'active',
            creationDate: '2023-01-01T00:00:00Z',
            terminationDate: null,
          },
          capacities: { actions: ['terminate'] },
        },
        expirationDate: '2024-01-01T00:00:00Z',
        nextBillingDate: '2024-02-01T00:00:00Z',
      },
      customer: { contacts: [{ type: 'admin', customerCode: 'abc' }] },
      resource: {
        name: 'service-1',
        state: 'active',
        product: { name: 'Product', description: 'Product Desc' },
        displayName: 'Service 1',
      },
      serviceId: 1,
      parentServiceId: null,
    },
  ];
  const mockCartServiceOption: TCartServiceOption[] = [
    {
      mandatory: false,
      exclusive: false,
      productName: 'Product',
      planCode: 'plan-1',
      family: 'family',
      productType: 'type',
      prices: [
        {
          pricingMode: 'default',
          description: 'desc',
          duration: 'P1M',
          minimumRepeat: 1,
          minimumQuantity: 1,
          priceInUcents: 1000,
          maximumQuantity: 1,
          interval: 1,
          capacities: [],
          maximumRepeat: null,
          price: { currencyCode: 'EUR', text: '10.00 €', value: 10 },
        },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  describe('useServiceIds', () => {
    it('should fetch service ids when projectId is provided', async () => {
      vi.mocked(getServiceId).mockResolvedValueOnce(mockServiceIds);

      const { result } = renderHook(() => useServiceIds('project-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      expect(getServiceId).toHaveBeenCalledWith('project-1');
      expect(result.current.data).toEqual(mockServiceIds);
      expect(result.current.error).toBeNull();
    });

    it('should not fetch service ids when projectId is not provided', async () => {
      const { result } = renderHook(() => useServiceIds(undefined), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      expect(getServiceId).not.toHaveBeenCalled();
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });
  });

  describe('useServiceOptions', () => {
    it('should fetch service options when serviceId is provided', async () => {
      vi.mocked(getServiceOptions).mockResolvedValueOnce(mockServiceOptions);

      const { result } = renderHook(() => useServiceOptions(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      expect(getServiceOptions).toHaveBeenCalledWith(1);
      expect(result.current.data).toEqual(mockServiceOptions);
      expect(result.current.error).toBeNull();
    });

    it('should not fetch service options when serviceId is not provided', async () => {
      const { result } = renderHook(() => useServiceOptions(undefined), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      expect(getServiceOptions).not.toHaveBeenCalled();
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });
  });

  describe('useCartServiceOption', () => {
    it('should fetch cart service option when projectId is provided', async () => {
      vi.mocked(getCartServiceOption).mockResolvedValueOnce(
        mockCartServiceOption,
      );

      const { result } = renderHook(() => useCartServiceOption('project-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      expect(getCartServiceOption).toHaveBeenCalledWith('project-1');
      expect(result.current.data).toEqual(mockCartServiceOption);
      expect(result.current.error).toBeNull();
    });

    it('should not fetch cart service option when projectId is not provided', async () => {
      const { result } = renderHook(() => useCartServiceOption(undefined), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      expect(getCartServiceOption).not.toHaveBeenCalled();
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });
  });
});
