import { apiClient } from '@ovh-ux/manager-core-api';
import { Location } from '@ovh-ux/shell';

import { ObservabilityService } from '@/types/observability.type';

export const getObservabilityServices = async (
  signal: AbortSignal,
): Promise<ObservabilityService[]> => {
  const { data } = await apiClient.v2.get<ObservabilityService[]>('/observability/resource', {
    signal,
  });
  return data;
};

export const getLocations = async (signal: AbortSignal): Promise<Location[]> => {
  const { data } = await apiClient.v2.get<Location[]>('location', {
    signal,
  });
  return data;
};
