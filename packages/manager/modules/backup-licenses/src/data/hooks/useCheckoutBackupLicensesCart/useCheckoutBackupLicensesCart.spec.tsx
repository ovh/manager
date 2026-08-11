import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MOCK_CART_ID } from '@/mocks/order/order.mock';
import { MockParams, setupMswMock } from '@/test-utils/setupMsw';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';
import {
  WatchedApiRequest,
  resolveApiRequests,
  stopWatchingApiCalls,
  watchApiRequests,
} from '@/test-utils/watchApiCalls';

import { useCheckoutBackupLicensesCart } from './useCheckoutBackupLicensesCart';

const renderCheckoutHook = async (mockParams: MockParams = {}) => {
  setupMswMock(mockParams);
  const wrapper = await testWrapperBuilder().withQueryClient().withShellContext().build();
  const onSuccess = vi.fn();
  const { result } = renderHook(() => useCheckoutBackupLicensesCart({ onSuccess }), { wrapper });

  return { result, onSuccess };
};

describe('useCheckoutBackupLicensesCart', () => {
  let requests: Promise<WatchedApiRequest>[];

  beforeEach(() => {
    vi.clearAllMocks();
    requests = watchApiRequests('/order/cart');
  });

  afterEach(() => {
    stopWatchingApiCalls();
  });

  it('engages the prepared cart with a single checkout post', async () => {
    const { result, onSuccess } = await renderCheckoutHook();

    result.current.mutate({ cartId: MOCK_CART_ID });

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    const emitted = await resolveApiRequests(requests);
    const posted = emitted.filter(({ method }) => method === 'POST');

    expect(posted).toHaveLength(1);
    expect(posted[0]?.url).toContain(`/order/cart/${MOCK_CART_ID}/checkout`);
    expect(posted[0]?.body).toEqual({
      autoPayWithPreferredPaymentMethod: true,
      waiveRetractationPeriod: true,
    });
  });

  it('never rebuilds the cart: no item, no assign, nothing but the checkout', async () => {
    const { result, onSuccess } = await renderCheckoutHook();

    result.current.mutate({ cartId: MOCK_CART_ID });

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    const emitted = await resolveApiRequests(requests);

    expect(emitted.filter(({ url }) => url.endsWith('/order/cart'))).toHaveLength(0);
    expect(emitted.filter(({ url }) => url.includes('/assign'))).toHaveLength(0);
  });

  it('reports the failure without announcing a success', async () => {
    const { result, onSuccess } = await renderCheckoutHook({ isOrderError: true });

    result.current.mutate({ cartId: MOCK_CART_ID });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
