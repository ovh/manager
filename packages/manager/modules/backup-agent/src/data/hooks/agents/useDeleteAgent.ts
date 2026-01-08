import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import { deleteBackupAgent } from '@/data/api/agents/agents.requests';
import { useGetBackupServicesId } from '@/data/hooks/backup/useBackupServicesId';

import { BACKUP_TENANTS_QUERY_KEY } from '../tenants/useBackupTenants';

type DeleteAgentParams = {
  vspcTenantId: string;
  agentId: string;
};

type UseDeleteTenantAgentParams = Partial<
  UseMutationOptions<ApiResponse<string>, ApiError, DeleteAgentParams>
>;

export const useDeleteTenantAgent = (options: UseDeleteTenantAgentParams = {}) => {
  const getBackupServiceId = useGetBackupServicesId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vspcTenantId, agentId }) => {
      const backupServicesId = await getBackupServiceId();
      return deleteBackupAgent({
        backupServicesId: backupServicesId!,
        vspcTenantId,
        backupAgentId: agentId,
      });
    },
    ...options,
    onSuccess: async (...params) => {
      await queryClient.invalidateQueries({
        queryKey: BACKUP_TENANTS_QUERY_KEY,
      });
      options.onSuccess?.(...params);
    },
  });
};
