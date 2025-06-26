import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as cartApi from '@/data/api/cart';
import * as paymentApi from '@/data/api/payment';
import * as servicesApi from '@/data/api/services';
import { createWrapper, shellContext } from '@/wrapperRenders';
import {
  useCheckoutAndPayCart,
  useGetHdsCartServiceOption,
  useIsAValidHdsSupportLevel,
  useIsAlreadyHdsCertifiedProject,
  useIsHdsFeatureAvailabilityEnabled,
  usePrepareHdsCart,
} from './useHds';

vi.mock('@ovh-ux/manager-react-components', () => ({
  useFeatureAvailability: vi.fn(),
}));

vi.mock('@/data/api/cart', () => ({
  createCart: vi.fn(),
  assignCart: vi.fn(),
  addOptionToCart: vi.fn(),
  checkoutCart: vi.fn(),
}));

vi.mock('@/data/api/services', () => ({
  getServiceId: vi.fn(),
  getServiceOptions: vi.fn(),
  getCartServiceOption: vi.fn(),
}));

vi.mock('@/data/api/payment', () => ({
  payWithRegisteredPaymentMean: vi.fn(),
}));

describe('useHds hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useIsHdsFeatureAvailabilityEnabled returns true if feature is available', () => {
    vi.mocked(useFeatureAvailability).mockReturnValue(({
      data: { 'public-cloud:hds': true },
      error: null,
      isError: false,
      isSuccess: true,
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    const { result } = renderHook(() => useIsHdsFeatureAvailabilityEnabled(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBe(true);
  });

  it('useIsHdsFeatureAvailabilityEnabled returns false if feature is not available', () => {
    vi.mocked(useFeatureAvailability).mockReturnValue(({
      data: { 'public-cloud:hds': false },
      isLoading: false,
      isSuccess: true,
      status: 'success',
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    const { result } = renderHook(() => useIsHdsFeatureAvailabilityEnabled(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBe(false);
  });

  it('useIsAValidHdsSupportLevel returns true for enterprise or business', () => {
    const customContext = {
      ...shellContext,
      environment: {
        ...shellContext.environment,
        getUser: () => ({ supportLevel: { level: 'enterprise' } }),
      },
    };

    const { result: resultEnterprise } = renderHook(
      () => useIsAValidHdsSupportLevel(),
      {
        wrapper: createWrapper(
          (customContext as unknown) as typeof shellContext,
        ),
      },
    );

    expect(resultEnterprise.current).toBe(true);

    const customContext2 = {
      ...shellContext,
      environment: {
        ...shellContext.environment,
        getUser: () => ({ supportLevel: { level: 'business' } }),
      },
    };

    const { result: resultBusiness } = renderHook(
      () => useIsAValidHdsSupportLevel(),
      {
        wrapper: createWrapper(
          (customContext2 as unknown) as typeof shellContext,
        ),
      },
    );

    expect(resultBusiness.current).toBe(true);
  });

  it('useIsAValidHdsSupportLevel returns false for other levels', () => {
    const customContext = {
      ...shellContext,
      environment: {
        ...shellContext.environment,
        getUser: () => ({ supportLevel: { level: 'basic' } }),
      },
    };
    const { result } = renderHook(() => useIsAValidHdsSupportLevel(), {
      wrapper: createWrapper((customContext as unknown) as typeof shellContext),
    });
    expect(result.current).toBe(false);
  });

  it('useIsAlreadyHdsCertifiedProject returns true if project is certified', async () => {
    vi.mocked(servicesApi.getServiceId).mockResolvedValue([1]);
    vi.mocked(servicesApi.getServiceOptions).mockResolvedValue([
      {
        route: { url: '', path: '', vars: [] },
        billing: {
          plan: { code: 'certification.hds', invoiceName: '' },
          renew: null,
          pricing: {
            price: { text: '', value: 0, currencyCode: '' },
            duration: '',
            interval: 0,
            capacities: [],
            description: '',
            pricingMode: '',
            pricingType: '',
            maximumRepeat: null,
            minimumRepeat: 0,
            priceInUcents: 0,
            maximumQuantity: 0,
            minimumQuantity: 0,
          },
          lifecycle: {
            current: {
              state: 'active',
              creationDate: '',
              terminationDate: null,
            },
            capacities: { actions: [] },
          },
          expirationDate: '',
          nextBillingDate: '',
        },
        customer: { contacts: [] },
        resource: {
          name: '',
          state: '',
          product: { name: 'publiccloud-certification-hds', description: '' },
          displayName: '',
        },
        serviceId: 1,
        parentServiceId: null,
      },
    ]);

    const { result } = renderHook(
      () => useIsAlreadyHdsCertifiedProject('project-1'),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe(true);
  });

  it('useGetHdsCartServiceOption returns the correct cart service option', async () => {
    vi.mocked(servicesApi.getCartServiceOption).mockResolvedValue([
      {
        mandatory: false,
        exclusive: false,
        productName: '',
        planCode: 'certification.hds',
        family: '',
        productType: '',
        prices: [],
      },
      {
        mandatory: false,
        exclusive: false,
        productName: '',
        planCode: 'other',
        family: '',
        productType: '',
        prices: [],
      },
    ]);

    const { result } = renderHook(
      () => useGetHdsCartServiceOption('project-1'),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({
      mandatory: false,
      exclusive: false,
      productName: '',
      planCode: 'certification.hds',
      family: '',
      productType: '',
      prices: [],
    });
  });

  it('usePrepareHdsCart prepares the cart and returns cart object', async () => {
    vi.mocked(cartApi.createCart).mockResolvedValue({
      cartId: 'cart-1',
      description: '',
      expire: '',
      readOnly: false,
    });
    vi.mocked(cartApi.assignCart).mockResolvedValue(undefined);
    vi.mocked(cartApi.addOptionToCart).mockResolvedValue({
      cartId: 'cart-1',
      itemId: 1,
      prices: [
        {
          price: {
            value: 10,
            currencyCode: 'EUR',
            priceInUcents: 1000,
            text: '10.00 €',
          },
          label: 'label',
        },
      ],
      duration: 'P1M',
      settings: {
        cartId: 'cart-1',
        pricingMode: 'default',
        subscription_id: 1,
        planCode: 'certification.hds',
        quantity: 1,
      },
      offerId: null,
      options: [],
      productId: 'product-1',
    });
    const cartServiceHDSOption = {
      mandatory: false,
      exclusive: false,
      productName: '',
      planCode: 'certification.hds',
      family: '',
      productType: '',
      prices: [
        {
          pricingMode: 'default',
          description: '',
          duration: 'P1M',
          minimumRepeat: 1,
          minimumQuantity: 1,
          priceInUcents: 1000,
          maximumQuantity: 1,
          interval: 1,
          capacities: ['renew'],
          maximumRepeat: null,
          price: { currencyCode: 'EUR', text: '10.00 €', value: 10 },
        },
      ],
    };

    const { result } = renderHook(
      () =>
        usePrepareHdsCart({
          projectId: 'project-1',
          cartServiceHDSOption,
          enabled: true,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(cartApi.createCart).toHaveBeenCalled();
    expect(cartApi.assignCart).toHaveBeenCalledWith('cart-1');
    expect(cartApi.addOptionToCart).toHaveBeenCalled();
    expect(result.current.data).toEqual({
      cartId: 'cart-1',
      description: '',
      expire: '',
      readOnly: false,
    });
  });

  it('useCheckoutAndPayCart calls payment API and triggers onSuccess', async () => {
    vi.mocked(cartApi.checkoutCart).mockResolvedValue({
      contracts: [],
      prices: {
        originalWithoutTax: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
        reduction: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
        tax: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
        withTax: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
        withoutTax: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
      },
      details: [],
      orderId: 1,
      url: '',
    });

    vi.mocked(paymentApi.payWithRegisteredPaymentMean).mockResolvedValue(
      undefined,
    );

    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(
      () => useCheckoutAndPayCart({ onSuccess, onError }),
      {
        wrapper: createWrapper(),
      },
    );

    await act(async () => {
      await result.current.mutateAsync({ cartId: 'cart-1' });
    });

    expect(cartApi.checkoutCart).toHaveBeenCalledWith('cart-1');
    expect(paymentApi.payWithRegisteredPaymentMean).toHaveBeenCalledWith(1, {
      paymentMean: 'fidelityAccount',
    });
    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('useCheckoutAndPayCart calls onError if payment mean is missing', async () => {
    vi.mocked(cartApi.checkoutCart).mockResolvedValue({
      contracts: [],
      prices: {
        originalWithoutTax: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
        reduction: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
        tax: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
        withTax: { value: 10, currencyCode: 'EUR', text: '10.00 €' },
        withoutTax: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
      },
      details: [],
      orderId: 1,
      url: '',
    });
    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () => useCheckoutAndPayCart({ onSuccess, onError }),
      {
        wrapper: createWrapper(),
      },
    );

    result.current.mutate({ cartId: 'cart-1' });

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });

    expect(onSuccess).not.toHaveBeenCalled();
  });
});
