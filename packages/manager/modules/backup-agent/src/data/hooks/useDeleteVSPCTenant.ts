import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import { deleteVSPCTenant } from '@/data/api/tenants/tenants.requests';
import { queryKeys } from '@/data/queries/queryKeys';
import { servicesQueries } from '@/data/queries/services.queries';
import { tenantsQueries } from '@/data/queries/tenants.queries';

export const useDeleteVSPCTenant = ({
  onSuccess,
  ...options
}: Omit<UseMutationOptions<string, ApiError, void>, 'mutationFn'> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const backupServicesId = await servicesQueries.withClient(queryClient).backupServicesId();
      const vspcTenantId = await tenantsQueries.withClient(queryClient).vspcTenantId();
      return deleteVSPCTenant(backupServicesId!, vspcTenantId);
    },
    onSuccess: async (...params) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.tenants.vspc.all(),
      });
      onSuccess?.(...params);
    },
    ...options,
  });
};
