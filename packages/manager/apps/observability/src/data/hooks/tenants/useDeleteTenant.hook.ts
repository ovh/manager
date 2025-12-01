import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteTenant } from '@/__mocks__/tenants/tenant.adapter';
import type { GetTenantPayload } from '@/data/api/tenants.props';
import { getTenantQueryKey, getTenantsQueryKey } from '@/data/hooks/tenants/useTenants.hook';
import { Tenant } from '@/types/tenants.type';

export const useDeleteTenant = (
  mutationOptions?: Omit<UseMutationOptions<Tenant, Error, GetTenantPayload>, 'mutationFn'>,
) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restOptions } = mutationOptions ?? {};

  return useMutation({
    ...restOptions,
    mutationFn: (payload: GetTenantPayload) => deleteTenant(payload),
    onSuccess: (deletedTenant, variables, context) => {
      void queryClient.invalidateQueries({
        queryKey: getTenantsQueryKey(variables.resourceName),
      });

      queryClient.setQueryData<Tenant>(
        getTenantQueryKey(variables.resourceName, variables.tenantId),
        deletedTenant,
      );
      onSuccess?.(deletedTenant, variables, context);
    },
    onError: (error, variables, context) => {
      onError?.(error, variables, context);
    },
  });
};
