import { apiClient } from '@ovh-ux/manager-core-api';

import { ObservabilityServiceParams } from '@/data/api/observability.props';
import { Tenant } from '@/types/tenants.type';

import { CreateTenantsPayload } from './tenants.props';

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

export const createTenants = async ({
  targetSpec,
  resourceName,
  signal,
}: CreateTenantsPayload): Promise<Tenant> => {
  const { data } = await apiClient.v2.post<Tenant>(
    `/observability/resource/${resourceName}/metric/tenant`,
    targetSpec,
    { signal },
  );
  return data;
};
