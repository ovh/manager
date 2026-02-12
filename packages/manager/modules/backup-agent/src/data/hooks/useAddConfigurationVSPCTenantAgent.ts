import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import {
  type AddBackupAgentConfigParams,
  postConfigurationBackupAgents,
} from '@/data/api/agents/agents.requests';
import { queryKeys } from '@/data/queries/queryKeys';
import { servicesQueries } from '@/data/queries/services.queries';
import { tenantsQueries } from '@/data/queries/tenants.queries';

type MutationPayload = Omit<AddBackupAgentConfigParams, 'backupServicesId' | 'vspcTenantId'>;

export const useAddConfigurationVSPCTenantAgent = ({
  onSuccess,
  ...options
}: Omit<UseMutationOptions<ApiResponse<string>, ApiError, MutationPayload>, 'mutationFn'> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: MutationPayload) => {
      const backupServicesId = await servicesQueries.withClient(queryClient).backupServicesId();
      const vspcTenantId = await tenantsQueries.withClient(queryClient).vspcTenantId();
      return postConfigurationBackupAgents({
        backupServicesId: backupServicesId!,
        vspcTenantId,
        ...payload,
      });
    },
    onSuccess: async (...params) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.tenants.vspc.all(),
      });
      onSuccess?.(...params);
    },
    ...options,
  });
};
