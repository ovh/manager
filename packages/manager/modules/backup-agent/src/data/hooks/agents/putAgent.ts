import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import {
  EditBackupAgentConfigParams,
  editConfigurationBackupAgents,
} from '@/data/api/agents/agents.requests';

import { useBackupServicesId } from '../backup/useBackupServicesId';
import { GET_VSPC_TENANTS_QUERY_KEY } from '../tenants/useVspcTenants';

type EditBackupConfigPayload = Omit<EditBackupAgentConfigParams, 'backupServicesId'>;
type UseEditConfigurationVSPCTenantAgentParams = Partial<
  UseMutationOptions<ApiResponse<string>, ApiError, EditBackupConfigPayload>
>;
export const useEditConfigurationVSPCTenantAgent = ({
  ...options
}: UseEditConfigurationVSPCTenantAgentParams) => {
  const queryClient = useQueryClient();
  const { backupServicesId } = useBackupServicesId();

  return useMutation({
    mutationFn: (payload: EditBackupConfigPayload) =>
      editConfigurationBackupAgents({ backupServicesId, ...payload }),
    ...options,
    onSuccess: async (...params) => {
      await queryClient.invalidateQueries({
        queryKey: GET_VSPC_TENANTS_QUERY_KEY,
      });
      options.onSuccess?.(...params);
    },
  });
};
