import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  validateSapForm,
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

export type UseApiValidationStepInitialParams<
  StepForm extends
    | EnablementForm
    | InitializationForm
    | DeploymentForm
    | ServerConfigForm
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

// export const useStepInitialValidation = (
//   params: UseApiValidationStepInitialParams<InitializationForm>,
// ) =>
//   useStepValidation({
//     mapper: mapFormInitialToStructured,
//     ...params,
//   });
