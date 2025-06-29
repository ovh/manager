import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  validateSapStepForm,
  ValidateSapStepResponse,
} from '@/data/api/apiValidation';
import {
  DeploymentForm,
  EnablementForm,
  InitializationForm,
  OSConfigForm,
  ServerConfigForm,
  SourceForm,
  StructuredInstallationForm,
  SystemForm,
} from '@/types/form.type';

export type UseApiValidationStepInitialParams<
  StepForm extends
    | EnablementForm
    | InitializationForm
    | DeploymentForm
    | (ServerConfigForm &
        Pick<InitializationForm, 'datacenterId'> &
        Pick<DeploymentForm, 'deploymentType'>)
    | OSConfigForm
    | SystemForm
    | SourceForm
> = {
  serviceName: string;
} & Partial<
  UseMutationOptions<ApiResponse<ValidateSapStepResponse>, ApiError, StepForm>
>;

export type UseApiValidationStepParams<
  TStepForm
> = UseApiValidationStepInitialParams<TStepForm> & {
  mapper: (form: TStepForm) => Partial<StructuredInstallationForm>;
};

export const useStepValidation = <TStepForm>({
  mapper,
  serviceName,
  ...restOptions
}: UseApiValidationStepParams<TStepForm>) =>
  useMutation({
    mutationFn: (form: TStepForm) =>
      validateSapStepForm({
        serviceName,
        form: mapper(form),
      }),
    ...restOptions,
  });
