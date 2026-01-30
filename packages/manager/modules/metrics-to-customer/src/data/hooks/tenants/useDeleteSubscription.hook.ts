import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteTenantSubscription } from '@/__mocks__/tenants/tenant.adapter';
import type { DeleteTenantSubscriptionPayload } from '@/data/api/tenants.props';
import { getTenantSubscriptionsQueryKey } from '@/data/hooks/tenants/useTenantSubscriptions.hook';
import { TenantSubscription } from '@/types/tenants.type';

export const useDeleteSubscription = (
  mutationOptions?: Omit<
    UseMutationOptions<TenantSubscription, Error, DeleteTenantSubscriptionPayload>,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restOptions } = mutationOptions ?? {};

  return useMutation({
    ...restOptions,
    mutationFn: (payload: DeleteTenantSubscriptionPayload) => deleteTenantSubscription(payload),
    onSuccess: (data, variables, context) => {
      void queryClient.invalidateQueries({
        queryKey: getTenantSubscriptionsQueryKey(variables.resourceName, variables.tenantId),
      });
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      onError?.(error, variables, context);
    },
  });
};
