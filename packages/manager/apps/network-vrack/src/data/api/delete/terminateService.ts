import { ApiResponse, v6 } from '@ovh-ux/manager-core-api';

export const terminateService = (serviceId: number): Promise<ApiResponse<void>> =>
  v6.delete(`/services/${serviceId}`);
