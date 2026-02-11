import { apiClient } from '@ovh-ux/manager-core-api';

import { EditObservabilityServicePayload } from '@/data/api/observability.props';
import { ObservabilityService } from '@/types/observability.type';

export const getObservabilityServices = async (
  signal: AbortSignal,
): Promise<ObservabilityService[]> => {
  const { data } = await apiClient.v2.get<ObservabilityService[]>('/observability/resource', {
    signal,
  });
  return data;
};

export const editObservabilityService = async ({
  resourceName,
  targetSpec,
  signal,
}: EditObservabilityServicePayload): Promise<ObservabilityService> => {
  const { data } = await apiClient.v2.put<ObservabilityService>(
    `/observability/resource/${resourceName}`,
    { targetSpec },
    { signal },
  );
  return data;
};
