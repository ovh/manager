import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { editTenant } from '@/__mocks__/tenants/tenant.adapter';
import type { EditTenantPayload } from '@/data/api/tenants.props';
import { Tenant } from '@/types/tenants.type';

import { getTenantQueryKey, getTenantsQueryKey } from './useTenants.hook';

export const useEditTenant = (
  mutationOptions?: Omit<UseMutationOptions<Tenant, Error, EditTenantPayload>, 'mutationFn'>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EditTenantPayload) => editTenant(payload),
    onSuccess: (updatedTenant, variables, context) => {
      void queryClient.invalidateQueries({
        queryKey: getTenantsQueryKey(variables.resourceName),
      });

      queryClient.setQueryData<Tenant>(
        getTenantQueryKey(variables.resourceName, variables.tenantId),
        updatedTenant,
      );
      mutationOptions?.onSuccess?.(updatedTenant, variables, context);
    },
    onError: (error, variables, context) => {
      mutationOptions?.onError?.(error, variables, context);
    },
    ...mutationOptions,
  });
};
