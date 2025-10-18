import React, { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import * as orderApi from '@/data/api/order/order';
import { useLastOrderTracking } from '@/data/hooks/lastOrderTracking/useLastOrderTracking';
import { LastOrderTrackingResponse } from '@/types/order.type';

const queryClient = new QueryClient();

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useLastOrderTracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('useLastOrderTracking should return expected result', async () => {
    const lastOrderTrackingResponse: LastOrderTrackingResponse = {
      date: 'date',
      expirationDate: 'expirationDate',
      orderId: 2,
      password: 'fakepassword',
      pdfUrl: 'pdfurl',
      priceWithoutTax: undefined,
      priceWithTax: undefined,
      retractionDate: 'date r',
      tax: undefined,
      url: 'url',
      history: [],
      status: 'delivered',
    };

    const getLastOrder = vi.spyOn(orderApi, 'getLastOrder').mockReturnValue(
      new Promise((resolve) =>
        resolve({
          data: {
            orderId: 2,
            date: 'date',
            expirationDate: 'expirationDate',
            password: 'fakepassword',
            pdfUrl: 'pdfurl',
            priceWithoutTax: undefined,
            priceWithTax: undefined,
            retractionDate: 'date r',
            tax: undefined,
            url: 'url',
          },
          status: 'OK',
        }),
      ),
    );

    const getOrderStatus = vi
      .spyOn(orderApi, 'getOrderStatus')
      .mockReturnValue(new Promise((resolve) => resolve('delivered')));

    const getOrderDetails = vi
      .spyOn(orderApi, 'getOrderDetails')
      .mockReturnValue(new Promise((resolve) => resolve([])));

    const getCompleteHistory = vi
      .spyOn(orderApi, 'getCompleteHistory')
      .mockReturnValue(new Promise((resolve) => resolve([])));

    const { result } = renderHook(() => useLastOrderTracking(), {
      wrapper,
    });

    await waitFor(() => {
      expect(getLastOrder).toHaveBeenCalled();
      expect(getOrderStatus).toHaveBeenCalled();
      expect(getOrderDetails).toHaveBeenCalled();
      expect(getCompleteHistory).toHaveBeenCalled();
      expect(result.current.data.expirationDate).toEqual(lastOrderTrackingResponse.expirationDate);
      expect(result.current.data.status).toEqual(lastOrderTrackingResponse.status);
    });
  });
});
