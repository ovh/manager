import { apiClient } from '@ovh-ux/manager-core-api';

import { ObservabilityService } from '@/types/observability.type';

export const getObservabilityServices = async (
  signal: AbortSignal,
): Promise<ObservabilityService[]> => {
  const { data } = await apiClient.v2.get<ObservabilityService[]>('/observability', { signal });
  return data;
};
