import { ApiResponse, v6 } from '@ovh-ux/manager-core-api';

type ValidateSapFormParams = {
  serviceName: string;
  form: string;
};

export const validateSapForm = ({
  serviceName,
  form,
}: ValidateSapFormParams): Promise<ApiResponse<string>> =>
  v6.post(`/dedicatedCloud/${serviceName}/sap`, form);
