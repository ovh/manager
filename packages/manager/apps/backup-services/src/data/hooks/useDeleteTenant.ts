import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import { deleteVSPCTenant } from '../api/Backup.api';
import { GET_VSPC_TENANTS_QUERY_KEY } from './useVspcTenants';

type UseDeleteVSPCTenantParams = Partial<UseMutationOptions<ApiResponse<string>, ApiError, string>>;

export const useDeleteVSPCTenant = (options: UseDeleteVSPCTenantParams = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vspcTenantId: string) => deleteVSPCTenant(vspcTenantId),
    ...options,
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: GET_VSPC_TENANTS_QUERY_KEY,
      });
      options.onSuccess?.(data, variables, context);
    },
  });
};
