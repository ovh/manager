import React, { PropsWithChildren } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, vi } from 'vitest';
import { useFetchHubLastOrder } from '@/data/hooks/lastOrder/useLastOrder';
import * as LastOrderApi from '@/data/api/lastOrder';
import { LastOrder } from '@/types/lastOrder.type';

const queryClient = new QueryClient();

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useFetchHubLastOrder', () => {
  it('returns no order if api returned none', async () => {
    const lastOrder: LastOrder = {
      status: 'OK',
      data: null,
    };
    const getLastOrder = vi
      .spyOn(LastOrderApi, 'getLastOrder')
      .mockReturnValue(new Promise((resolve) => resolve(lastOrder)));

    const { result } = renderHook(() => useFetchHubLastOrder(), {
      wrapper,
    });

    await waitFor(() => {
      expect(getLastOrder).toHaveBeenCalled();
      expect(result.current.data).toEqual(lastOrder);
    });
  });

  it('returns the last order if api returned one', () => {
    const lastOrder: LastOrder = {
      status: 'OK',
      data: {
        date: '2024-08-22T12:24:08+02:00',
        expirationDate: '2024-09-05T23:29:59+02:00',
        orderId: 99999999999,
        password: 'fakepassword',
        pdfUrl:
          'https://www.fake-order-url.com?orderId=fakeId&orderPassword=fakePassword',
        priceWithTax: {
          currencyCode: 'points',
          text: '0 PTS',
          value: 0,
        },
        priceWithoutTax: {
          currencyCode: 'points',
          text: '0 PTS',
          value: 0,
        },
        retractionDate: '2024-09-06T00:00:00+02:00',
        tax: {
          currencyCode: 'points',
          text: '0 PTS',
          value: 0,
        },
        url:
          'https://www.fake-order-url.com?orderId=fakeId&orderPassword=fakePassword',
      },
    };
    vi.spyOn(LastOrderApi, 'getLastOrder').mockReturnValue(
      new Promise((resolve) => resolve(lastOrder)),
    );

    const { result } = renderHook(() => useFetchHubLastOrder(), {
      wrapper,
    });

    waitFor(() => {
      expect(result.current.data).toEqual(lastOrder);
    });
  });
});
