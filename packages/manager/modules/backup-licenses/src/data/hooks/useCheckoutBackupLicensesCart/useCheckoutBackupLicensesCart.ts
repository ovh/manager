import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

import { TApiCustomError } from '@ovh-ux/manager-core-api';
import { Order } from '@ovh-ux/manager-module-order';

import { executeOrderCartCheckout } from '@/data/api/order/order.requests';
import { queryKeys } from '@/data/queries/queryKeys';

export type BackupLicensesCheckout = {
  cartId: string;
};

export const useCheckoutBackupLicensesCart = ({
  onSuccess,
}: {
  onSuccess: (order: Order, variables: BackupLicensesCheckout) => void;
}): UseMutationResult<Order, TApiCustomError, BackupLicensesCheckout> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId }: BackupLicensesCheckout) => executeOrderCartCheckout(cartId),
    onSuccess: async (order, variables) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.subscription.status() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.backupServices.tenants() });
      onSuccess(order, variables);
    },
  });
};
