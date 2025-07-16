import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as cartApi from '@/data/api/cart';
import * as servicesApi from '@/data/api/services';
import { createWrapper } from '@/wrapperRenders';
import {
  useGetHdsCartServiceOption,
  useIsAlreadyHdsCertifiedProject,
  usePrepareHdsCart,
} from './useHds';

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
      readonly: false,
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
      readonly: false,
    });
  });
});
