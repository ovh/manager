import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  deleteInstallation,
  TGetInstallationTaskParams,
} from '../api/sapInstallations';

type UseDeleteInstallationParams = TGetInstallationTaskParams &
  Partial<UseMutationOptions<ApiResponse<string>, ApiError, void>>;

export const useDeleteInstallation = ({
  serviceName,
  taskId,
  ...options
}: UseDeleteInstallationParams) =>
  useMutation({
    mutationFn: () => deleteInstallation({ serviceName, taskId }),
    ...options,
  });
