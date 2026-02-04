import { ApiResponse, v6 } from '@ovh-ux/manager-core-api';

export const terminateServiceAtRenew = (serviceId: number): Promise<ApiResponse<void>> =>
  v6.put(`/services/${serviceId}`, {
    terminationPolicy: 'terminateAtExpirationDate',
  });
