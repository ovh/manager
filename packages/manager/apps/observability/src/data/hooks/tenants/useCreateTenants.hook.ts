import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { createTenants } from '@/__mocks__/tenants/tenant.adapter';
import { CreateTenantsPayload } from '@/data/api/tenants.props';
import { Tenant } from '@/types/tenants.type';

import { getTenantsQueryKey } from './useTenants.hook';

export const useCreateTenants = (
  mutationOptions?: Omit<UseMutationOptions<Tenant, Error, CreateTenantsPayload>, 'mutationFn'>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTenantsPayload) => createTenants(payload),
    onSuccess: (tenant, variables, context) => {
      // Invalidate and refetch tenants list for the specific resource
      void queryClient.invalidateQueries({
        queryKey: getTenantsQueryKey(variables.resourceName),
      });
      mutationOptions?.onSuccess?.(tenant, variables, context);
    },
    onError: (error, variables, context) => {
      mutationOptions?.onError?.(error, variables, context);
    },
    ...mutationOptions,
  });
};
