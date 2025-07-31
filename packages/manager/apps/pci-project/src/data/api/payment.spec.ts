/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { payWithRegisteredPaymentMean } from './payment';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    post: vi.fn(),
  },
}));

const mockedV6Post = vi.mocked(v6.post);

describe('payWithRegisteredPaymentMean', () => {
  it('should call v6.post with correct endpoint and payload', async () => {
    mockedV6Post.mockResolvedValue({});
    const orderId = 123;
    const payload = { paymentMean: 'card' };

    await payWithRegisteredPaymentMean(orderId, payload);

    expect(mockedV6Post).toHaveBeenCalledWith(
      'me/order/123/payWithRegisteredPaymentMean',
      payload,
    );
  });

  it('should throw error when API call fails', async () => {
    mockedV6Post.mockRejectedValue(new Error('API Error'));

    await expect(
      payWithRegisteredPaymentMean(123, { paymentMean: 'card' }),
    ).rejects.toThrow('API Error');
  });
});
