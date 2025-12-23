import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import { deleteVSPCTenant } from '../../api/tenants/tenants.requests';
import { useBackupServicesId } from '../backup/useBackupServicesId';
import { GET_VSPC_TENANTS_QUERY_KEY } from './useVspcTenants';

type UseDeleteVSPCTenantParams = Partial<UseMutationOptions<string, ApiError, string>>;

export const useDeleteVSPCTenant = (options: UseDeleteVSPCTenantParams = {}) => {
  const queryClient = useQueryClient();
  const { backupServicesId } = useBackupServicesId();

  return useMutation({
    mutationFn: (vspcTenantId: string) => deleteVSPCTenant(backupServicesId, vspcTenantId),
    ...options,
    onSuccess: async (...params) => {
      await queryClient.invalidateQueries({
        queryKey: GET_VSPC_TENANTS_QUERY_KEY,
      });
      options.onSuccess?.(...params);
    },
  });
};
