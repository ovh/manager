import { apiClient } from '@ovh-ux/manager-core-api';

import { ObservabilityServiceParams } from '@/types/ClientApi.type';
import { Tenant } from '@/types/observability.type';

export const getTenants = async ({
  serviceName,
  signal,
}: ObservabilityServiceParams): Promise<Tenant[]> => {
  const { data } = await apiClient.v2.get<Tenant[]>(`/observability/${serviceName}/metric/tenant`, {
    signal,
  });
  return data;
};
