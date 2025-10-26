import { apiClient } from '@ovh-ux/manager-core-api';

import { ObservabilityServiceParams } from '@/data/api/observability.props';
import { Tenant } from '@/types/tenants.type';

export const getTenants = async ({
  resourceName,
  signal,
}: ObservabilityServiceParams): Promise<Tenant[]> => {
  const { data } = await apiClient.v2.get<Tenant[]>(
    `/observability/resource/${resourceName}/metric/tenant`,
    {
      signal,
    },
  );
  return data;
};
