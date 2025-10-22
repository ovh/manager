import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as cartApi from '@/data/api/cart';
import * as paymentApi from '@/data/api/payment';
import { createWrapper } from '@/wrapperRenders';
import { useCheckoutWithFidelityAccount } from './useCheckout';

vi.mock('@ovh-ux/manager-react-components', () => ({
  useFeatureAvailability: vi.fn(),
}));

vi.mock('@/data/api/cart', () => ({
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

describe('useCheckoutWithFidelityAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useCheckoutWithFidelityAccount calls payment API and triggers onSuccess', async () => {
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
      () => useCheckoutWithFidelityAccount({ onSuccess, onError }),
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

  it('useCheckoutWithFidelityAccount calls onError if payment mean is missing', async () => {
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
      () => useCheckoutWithFidelityAccount({ onSuccess, onError }),
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
