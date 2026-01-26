import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { postOrderCartCartIdCheckout } from '@ovh-ux/manager-module-order';

type UseCheckoutBackupAgentCartOptions = Partial<
  Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof postOrderCartCartIdCheckout>>,
      AxiosError<{ message: string }>,
      { cartId: string }
    >,
    'mutationFn'
  >
>;

export const useCheckoutBackupAgentCart = (options: UseCheckoutBackupAgentCartOptions = {}) => {
  return useMutation({
    mutationFn: ({ cartId }: { cartId: string }) =>
      postOrderCartCartIdCheckout({
        cartId,
        autoPayWithPreferredPaymentMethod: true,
        waiveRetractationPeriod: true,
      }),
    ...(options ?? {}),
  });
};
