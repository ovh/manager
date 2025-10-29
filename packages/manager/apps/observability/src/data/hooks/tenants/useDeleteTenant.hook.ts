import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteTenant } from '@/__mocks__/tenants/tenant.adapter';
import type { GetTenantPayload } from '@/data/api/tenants.props';
import { Tenant } from '@/types/tenants.type';

import { getTenantsQueryKey } from './useTenants.hook';

export const useDeleteTenant = (
  mutationOptions?: Omit<UseMutationOptions<Tenant, Error, GetTenantPayload>, 'mutationFn'>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GetTenantPayload) => deleteTenant(payload),

    onSuccess: (deletedTenant, variables, context) => {
      void queryClient.invalidateQueries({
        queryKey: getTenantsQueryKey(variables.resourceName),
      });

      queryClient.setQueryData<Tenant[]>(
        getTenantsQueryKey(variables.resourceName),
        (oldData) => oldData?.filter((t) => t.id !== deletedTenant.id) ?? oldData,
      );

      mutationOptions?.onSuccess?.(deletedTenant, variables, context);
    },

    onError: (error, variables, context) => {
      mutationOptions?.onError?.(error, variables, context);
    },

    ...mutationOptions,
  });
};
