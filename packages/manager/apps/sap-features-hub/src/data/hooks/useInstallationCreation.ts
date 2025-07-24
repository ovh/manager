import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { createInstallation } from '@/data/api/sapInstallations';
import { StructuredInstallationForm } from '@/types/form.type';

type UseInstallationCreationParams = {
  serviceName: string;
} & Partial<
  UseMutationOptions<ApiResponse<string>, ApiError, StructuredInstallationForm>
>;

export const useInstallationCreation = ({
  serviceName,
  ...options
}: UseInstallationCreationParams) =>
  useMutation({
    mutationKey: ['vmwareServices'],
    mutationFn: (form: StructuredInstallationForm) =>
      createInstallation({ serviceName, form }),
    ...options,
  });
