import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export const getVrackList = (): Promise<ApiResponse<string[]>> =>
  apiClient.v6.get('/vrack');
