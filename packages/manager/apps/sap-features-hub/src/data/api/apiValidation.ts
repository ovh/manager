import { ApiResponse, v6 } from '@ovh-ux/manager-core-api';
import { StructuredInstallationForm } from '@/types/form.type';

type ValidateSapFormParams = {
  serviceName: string;
  form: string;
};

export const validateSapForm = ({
  serviceName,
  form,
}: ValidateSapFormParams): Promise<ApiResponse<string>> =>
  v6.post(`/dedicatedCloud/${serviceName}/sap`, form);

export type ValidateSapStepResponse = {
  class: string;
  message: string;
  details: Record<string, string>;
};

type ValidateStepSapFormParams = {
  serviceName: string;
  form: Partial<StructuredInstallationForm>;
};

export const validateSapStepForm = ({
  serviceName,
  form,
}: ValidateStepSapFormParams): Promise<ApiResponse<ValidateSapStepResponse>> =>
  v6.post(`/dedicatedCloud/${serviceName}/sap/validate`, form);
