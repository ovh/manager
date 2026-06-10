import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import { TerminateServiceResponse, terminateService } from '@/data/api/services/services.requests';
import { queryKeys } from '@/data/queries/queryKeys';

export const useTerminateVspcService = ({
  onSuccess,
  ...options
}: Omit<UseMutationOptions<TerminateServiceResponse, ApiError, number>, 'mutationFn'> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceId: number) => terminateService(serviceId),
    onSuccess: async (...params) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.tenants.all });
      onSuccess?.(...params);
    },
    ...options,
  });
};
