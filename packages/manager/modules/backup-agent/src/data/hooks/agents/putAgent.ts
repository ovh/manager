import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import {
  EditConfigurationBackupAgentsParams,
  editConfigurationBackupAgents,
} from '@/data/api/agents/agents.requests';

import { GET_VSPC_TENANTS_QUERY_KEY } from '../tenants/useVspcTenants';

type UseEditConfigurationVSPCTenantAgentParams = Partial<
  UseMutationOptions<ApiResponse<string>, ApiError, EditConfigurationBackupAgentsParams>
>;
export const useEditConfigurationVSPCTenantAgent = ({
  ...options
}: UseEditConfigurationVSPCTenantAgentParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EditConfigurationBackupAgentsParams) =>
      editConfigurationBackupAgents(payload),
    ...options,
    onSuccess: async (...params) => {
      await queryClient.invalidateQueries({
        queryKey: GET_VSPC_TENANTS_QUERY_KEY,
      });
      options.onSuccess?.(...params);
    },
  });
};
