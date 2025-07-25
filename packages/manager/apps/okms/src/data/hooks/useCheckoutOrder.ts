import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  Order,
  postOrderCartCartIdCheckout,
} from '@ovh-ux/manager-module-order';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

export const useCheckoutOrder = (
  options: Partial<
    UseMutationOptions<ApiResponse<Order>, ApiError, { cartId: string }>
  > = {},
) => {
  return useMutation<ApiResponse<Order>, ApiError, { cartId: string }>({
    mutationFn: ({ cartId }) =>
      postOrderCartCartIdCheckout({
        cartId,
        autoPayWithPreferredPaymentMethod: true,
        waiveRetractationPeriod: true,
      }),
    ...(options ?? {}),
  });
};
