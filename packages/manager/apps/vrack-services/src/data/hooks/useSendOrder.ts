import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  Order,
  postOrderCartCartIdCheckout,
} from '@ovh-ux/manager-module-order';

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
  const [sendOrderState, setSendOrderState] = useState<SendOrderState>(
    SendOrderState.INACTIVE,
  );
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
      const {
        request: { status },
      } = error;
      if (status === 400) {
        try {
          const sendOrderResponse = await postOrderCartCartIdCheckout({
            cartId,
            autoPayWithPreferredPaymentMethod: false,
            waiveRetractationPeriod: true,
          });
          setSendOrderState(SendOrderState.DONE);
          window.top.location.href = sendOrderResponse.data.url;
          onSuccess?.(sendOrderResponse);
          return Promise.resolve(sendOrderResponse);
        } catch (e) {
          setSendOrderState(SendOrderState.ERROR);
          onError?.(e);
          return Promise.reject(e);
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
