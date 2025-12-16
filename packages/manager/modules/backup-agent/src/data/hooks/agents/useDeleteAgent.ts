import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import { deleteBackupAgent } from '@/data/api/agents/agents.requests';

import { useBackupServicesId } from '../backup/useBackupServicesId';
import { BACKUP_TENANTS_QUERY_KEY } from '../tenants/useBackupTenants';

type DeleteAgentParams = {
  vspcTenantId: string;
  agentId: string;
};

type UseDeleteTenantAgentParams = Partial<
  UseMutationOptions<ApiResponse<string>, ApiError, DeleteAgentParams>
>;

export const useDeleteTenantAgent = (options: UseDeleteTenantAgentParams = {}) => {
  const queryClient = useQueryClient();
  const { backupServicesId } = useBackupServicesId();

  return useMutation({
    mutationFn: ({ vspcTenantId, agentId }) =>
      deleteBackupAgent({ backupServicesId, vspcTenantId, backupAgentId: agentId }),
    ...options,
    onSuccess: async (...params) => {
      await queryClient.invalidateQueries({
        queryKey: BACKUP_TENANTS_QUERY_KEY,
      });
      options.onSuccess?.(...params);
    },
  });
};
