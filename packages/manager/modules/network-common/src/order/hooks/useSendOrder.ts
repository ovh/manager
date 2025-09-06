import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { Order, postOrderCartCartIdCheckout } from '@ovh-ux/manager-module-order';

export enum SendOrderState {
  INACTIVE = 'inactive',
  PENDING = 'pending',
  DONE = 'done',
  ERROR = 'error',
}
/**
 * Try to create an order with automatic validation
 * If it fails, redirect to express order
 */
export const useSendOrder = () => {
  const [sendOrderState, setSendOrderState] = useState<SendOrderState>(SendOrderState.INACTIVE);
  const {
    mutate: sendOrder,
    isPending,
    error: orderError,
    isError,
    data,
  } = useMutation<
    ApiResponse<Order>,
    ApiError,
    {
      cartId: string;
      onSuccess?: (data: ApiResponse<Order>) => void;
      onError?: (data: ApiError) => void;
    }
  >({
    mutationFn: ({ cartId }) => {
      setSendOrderState(SendOrderState.PENDING);
      return postOrderCartCartIdCheckout({
        cartId,
        autoPayWithPreferredPaymentMethod: true,
        waiveRetractationPeriod: true,
      });
    },
    onSuccess: (response, { onSuccess }) => {
      setSendOrderState(SendOrderState.DONE);
      onSuccess?.(response);
    },
    onError: async (error, { cartId, onSuccess, onError }) => {
      const status: number | undefined = (error.request as { status?: number })?.status;

      if (status === 400) {
        try {
          const sendOrderResponse = await postOrderCartCartIdCheckout({
            cartId,
            autoPayWithPreferredPaymentMethod: false,
            waiveRetractationPeriod: true,
          });
          setSendOrderState(SendOrderState.DONE);

          if (window.top) {
            window.top.location.href = sendOrderResponse.data.url;
          }

          onSuccess?.(sendOrderResponse);
          return Promise.resolve(sendOrderResponse);
        } catch (error) {
          const exception = error as ApiError;
          setSendOrderState(SendOrderState.ERROR);
          onError?.(exception);
          return Promise.reject(exception);
        }
      }
      setSendOrderState(SendOrderState.ERROR);
      onError?.(error);
      return Promise.reject(error);
    },
  });

  return {
    sendOrder,
    isPending: isPending && sendOrderState === SendOrderState.PENDING,
    sendOrderState,
    error: orderError,
    isError,
    data,
  };
};
