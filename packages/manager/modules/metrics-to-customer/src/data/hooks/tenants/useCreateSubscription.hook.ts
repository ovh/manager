import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@ovh-ux/manager-core-api';

import { TenantSubscription } from '@/types/tenants.type';
import { getTenantSubscriptionsQueryKey } from '@/data/hooks/tenants/useTenantSubscriptions.hook';

export type CreateSubscriptionPayload = {
  subscribeUrl: string;
  tenantId: string;
  resourceName: string;
  signal?: AbortSignal;
};

export const useCreateSubscription = (
  mutationOptions?: Omit<
    UseMutationOptions<TenantSubscription, Error, CreateSubscriptionPayload>,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restOptions } = mutationOptions ?? {};

  return useMutation({
    ...restOptions,
    mutationFn: async (payload: CreateSubscriptionPayload) => {
      const { subscribeUrl, signal } = payload;
      const { data } = await apiClient.v2.post<TenantSubscription>(subscribeUrl, {}, { signal });
      return data;
    },
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
