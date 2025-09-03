import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { createInstallation } from '@/data/api/sapInstallations';
import { StructuredInstallationForm } from '@/types/form.type';
import { useHistoryInvalidation } from '@/hooks/queryInvalidation/useHistoryInvalidation';

type UseInstallationCreationParams = {
  serviceName: string;
} & Partial<
  UseMutationOptions<ApiResponse<string>, ApiError, StructuredInstallationForm>
>;

export const useInstallationCreation = ({
  serviceName,
  ...options
}: UseInstallationCreationParams) => {
  const invalidateInstallationHistory = useHistoryInvalidation();

  return useMutation({
    mutationFn: (form: StructuredInstallationForm) =>
      createInstallation({ serviceName, form }),
    ...options,
    onSuccess: (data, variables, context) => {
      invalidateInstallationHistory();
      options.onSuccess?.(data, variables, context);
    },
  });
};
