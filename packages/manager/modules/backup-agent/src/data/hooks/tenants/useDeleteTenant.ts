import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import { useGetBackupServicesId } from '@/data/hooks/backup/useBackupServicesId';
import { useGetVspcTenantId } from '@/data/hooks/tenants/useVspcTenantId';

import { deleteVSPCTenant } from '../../api/tenants/tenants.requests';
import { GET_VSPC_TENANTS_QUERY_KEY } from './useVspcTenants';

type UseDeleteVSPCTenantParams = Partial<UseMutationOptions<string, ApiError, void>>;

export const useDeleteVSPCTenant = (
  options: Omit<UseDeleteVSPCTenantParams, 'backupServicesId'> = {},
) => {
  const queryClient = useQueryClient();
  const getBackupServiceId = useGetBackupServicesId();
  const getVspcTenantId = useGetVspcTenantId();

  return useMutation({
    mutationFn: async () => {
      const backupServicesId = await getBackupServiceId();
      const vspcTenantId = await getVspcTenantId();

      return deleteVSPCTenant(backupServicesId!, vspcTenantId);
    },
    ...options,
    onSuccess: async (...params) => {
      await queryClient.invalidateQueries({
        queryKey: GET_VSPC_TENANTS_QUERY_KEY,
      });
      options.onSuccess?.(...params);
    },
  });
};
