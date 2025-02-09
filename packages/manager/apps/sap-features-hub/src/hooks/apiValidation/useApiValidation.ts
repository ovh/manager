import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { validateSapForm } from '@/data/api/apiValidation';

type UseApiValidationParams = {
  serviceName: string;
} & Partial<UseMutationOptions<ApiResponse<string>, ApiError, string>>;

export const useApiValidation = ({
  serviceName,
  ...options
}: UseApiValidationParams) =>
  useMutation({
    mutationKey: ['vmwareServices'],
    mutationFn: (form: string) => validateSapForm({ serviceName, form }),
    ...options,
  });
