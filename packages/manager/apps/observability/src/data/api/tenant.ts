import { apiClient } from '@ovh-ux/manager-core-api';

import { Tenant } from '@/types/observability.type';

export const getTenants = async (serviceName: string, signal: AbortSignal): Promise<Tenant[]> => {
  const { data } = await apiClient.v2.get<Tenant[]>(`/observability/${serviceName}/metric/tenant`, {
    signal,
  });
  return data;
};
