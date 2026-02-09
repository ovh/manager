import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import { deleteBackupAgent } from '@/data/api/agents/agents.requests';
import { queryKeys } from '@/data/queries/queryKeys';
import { servicesQueries } from '@/data/queries/services.queries';
import { tenantsQueries } from '@/data/queries/tenants.queries';

type DeleteAgentParams = {
  agentId: string;
};

export const useDeleteTenantAgent = ({
  onSuccess,
  ...options
}: Omit<
  UseMutationOptions<ApiResponse<string>, ApiError, DeleteAgentParams>,
  'mutationFn'
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ agentId }: DeleteAgentParams) => {
      const backupServicesId = await servicesQueries.withClient(queryClient).backupServicesId();
      const vspcTenantId = await tenantsQueries.withClient(queryClient).vspcTenantId();
      return deleteBackupAgent({
        backupServicesId: backupServicesId!,
        vspcTenantId,
        backupAgentId: agentId,
      });
    },
    onSuccess: async (...params) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.tenants.all,
      });
      onSuccess?.(...params);
    },
    ...options,
  });
};
