import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { CreateCartResult } from '@ovh-ux/manager-module-order';
import { createVrackServicesCart } from '../utils/cart';
import { useSendOrder } from './useSendOrder';

export const useCreateVrackServicesCart = () => {
  const {
    sendOrder,
    isPending: isSendOrderPending,
    error: sendOrderError,
    isError: isSendOrderError,
    sendOrderState,
  } = useSendOrder();

  const { mutate: createCart, data, error, isError, isPending } = useMutation<
    CreateCartResult,
    ApiError,
    { hasVrack?: boolean; region: string; ovhSubsidiary: string }
  >({
    mutationFn: async (params) => {
      const createCartResponse = await createVrackServicesCart(params);

      if (createCartResponse.contractList.length === 0)
        await sendOrder({ cartId: createCartResponse.cartId });

      return createCartResponse;
    },
  });

  return {
    createCart,
    data,
    error,
    isError,
    isPending,
    isSendOrderPending,
    isSendOrderError,
    sendOrderError,
    sendOrderState,
  };
};
