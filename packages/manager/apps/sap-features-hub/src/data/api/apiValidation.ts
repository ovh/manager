import { ApiResponse, v6 } from '@ovh-ux/manager-core-api';
import { StructuredInstallationForm } from '@/types/form.type';

export type ValidateSapStepResponse = {
  class: string;
  message: string;
  details: Record<string, string>;
};

type ValidateSapStepFormParams = {
  serviceName: string;
  form: Partial<StructuredInstallationForm>;
};

export const validateSapStepForm = ({
  serviceName,
  form,
}: ValidateSapStepFormParams): Promise<ApiResponse<ValidateSapStepResponse>> =>
  v6.post(`/dedicatedCloud/${serviceName}/sap/validate`, form);
