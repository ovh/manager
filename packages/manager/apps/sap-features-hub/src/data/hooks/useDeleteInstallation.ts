import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  deleteInstallation,
  TGetInstallationTaskParams,
} from '../api/sapInstallations';
import { useHistoryInvalidation } from '@/hooks/queryInvalidation/useHistoryInvalidation';

type UseDeleteInstallationParams = TGetInstallationTaskParams &
  Partial<UseMutationOptions<ApiResponse<string>, ApiError, void>>;

export const useDeleteInstallation = ({
  serviceName,
  taskId,
  ...options
}: UseDeleteInstallationParams) => {
  const invalidateInstallationHistory = useHistoryInvalidation();

  return useMutation({
    mutationFn: () => deleteInstallation({ serviceName, taskId }),
    ...options,
    onSuccess: (data, variables, context) => {
      invalidateInstallationHistory();
      options.onSuccess?.(data, variables, context);
    },
  });
};
