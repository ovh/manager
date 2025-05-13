import apiClient, { ApiResponse } from '@ovh-ux/manager-core-api';
import { TServiceConsumption } from '@/type/service-consumption.type';

export const getServiceConsumption = async (
  serviceId: number,
  signal: AbortSignal,
): Promise<ApiResponse<TServiceConsumption[]>> =>
  apiClient.v6.get(`/services/${serviceId}/consumption/element`, { signal });
