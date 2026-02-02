import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import {
  EditBackupAgentConfigParams,
  editConfigurationBackupAgents,
} from '@/data/api/agents/agents.requests';
import { useGetBackupServicesId } from '@/data/hooks/backup/useBackupServicesId';

import { GET_VSPC_TENANTS_QUERY_KEY } from '../tenants/useVspcTenants';

type EditBackupConfigPayload = EditBackupAgentConfigParams;
type UseEditConfigurationVSPCTenantAgentParams = Partial<
  UseMutationOptions<
    ApiResponse<string>,
    ApiError,
    Omit<EditBackupConfigPayload, 'backupServicesId'>
  >
>;
export const useEditConfigurationVSPCTenantAgent = (
  options: UseEditConfigurationVSPCTenantAgentParams = {},
) => {
  const getBackupServiceId = useGetBackupServicesId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Omit<EditBackupConfigPayload, 'backupServicesId'>) => {
      const backupServicesId = await getBackupServiceId();

      return editConfigurationBackupAgents({ backupServicesId: backupServicesId!, ...payload });
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
