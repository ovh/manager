import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';
import { describe, it, vi } from 'vitest';
import { useFetchLastOrder } from '@/data/hooks/apiOrder/useLastOrder';
import { LastOrderTrackingResponse } from '@/types/order.type';
import * as orderApi from '@/data/api/apiOrder/apiOrder';

const queryClient = new QueryClient();

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useLastOrder', () => {
  it('useFetchLastOrder should return expected result', async () => {
    const orderResponseData: LastOrderTrackingResponse = {
      date: 'date',
      expirationDate: 'expirationDate',
      orderId: 2,
      password: 'password',
      pdfUrl: 'pdfurl',
      priceWithoutTax: undefined,
      priceWithTax: undefined,
      retractionDate: 'date r',
      tax: undefined,
      url: 'url',
      history: [],
      status: 'status',
    };
    const getHubSupport = vi
      .spyOn(orderApi, 'fetchOrder')
      .mockReturnValue(new Promise((resolve) => resolve(orderResponseData)));

    const { result } = renderHook(() => useFetchLastOrder(), {
      wrapper,
    });

    await waitFor(() => {
      expect(getHubSupport).toHaveBeenCalled();
      expect(result.current.data.expirationDate).toEqual(
        orderResponseData.expirationDate,
      );
      expect(result.current.data.status).toEqual(orderResponseData.status);
    });
  });
});
