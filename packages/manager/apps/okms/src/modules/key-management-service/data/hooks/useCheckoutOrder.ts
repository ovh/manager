import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { ApiResponse } from '@ovh-ux/manager-core-api';
import { Order, postOrderCartCartIdCheckout } from '@ovh-ux/manager-module-order';

import { ErrorResponse } from '@/common/types/api.type';

export const useCheckoutOrder = (
  options: Partial<UseMutationOptions<ApiResponse<Order>, ErrorResponse, { cartId: string }>> = {},
) => {
  return useMutation<ApiResponse<Order>, ErrorResponse, { cartId: string }>({
    mutationFn: ({ cartId }) =>
      postOrderCartCartIdCheckout({
        cartId,
        autoPayWithPreferredPaymentMethod: true,
        waiveRetractationPeriod: true,
      }),
    ...(options ?? {}),
  });
};
