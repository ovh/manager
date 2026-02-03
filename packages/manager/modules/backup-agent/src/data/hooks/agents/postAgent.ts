import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import {
  AddBackupAgentConfigParams,
  postConfigurationBackupAgents,
} from '@/data/api/agents/agents.requests';
import { useGetBackupServicesId } from '@/data/hooks/backup/useBackupServicesId';
import { useGetVspcTenantId } from '@/data/hooks/tenants/useVspcTenantId';

import { GET_VSPC_TENANTS_QUERY_KEY } from '../tenants/useVspcTenants';

type AddBackupConfigPayload = AddBackupAgentConfigParams;
type UseAddConfigurationVSPCTenantAgentParams = Partial<
  UseMutationOptions<
    ApiResponse<string>,
    ApiError,
    Omit<AddBackupConfigPayload, 'backupServicesId' | 'vspcTenantId'>
  >
>;
export const useAddConfigurationVSPCTenantAgent = (
  options: UseAddConfigurationVSPCTenantAgentParams = {},
) => {
  const getBackupServiceId = useGetBackupServicesId();
  const getVspcTenantId = useGetVspcTenantId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: Omit<AddBackupConfigPayload, 'backupServicesId' | 'vspcTenantId'>,
    ) => {
      const backupServicesId = await getBackupServiceId();
      const vspcTenantId = await getVspcTenantId();

      return postConfigurationBackupAgents({
        backupServicesId: backupServicesId!,
        vspcTenantId,
        ...payload,
      });
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
