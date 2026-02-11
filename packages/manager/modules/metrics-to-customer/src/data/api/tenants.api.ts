import { apiClient } from '@ovh-ux/manager-core-api';

import {  
  DeleteTenantSubscriptionPayload,  
  GetTenantPayload,
  GetTenantsPayload,
} from '@/data/api/tenants.props';
import { Tenant, TenantSubscription } from '@/types/tenants.type';

export const getTenants = async ({
  resourceName,
  signal,
  iamTags,
}: GetTenantsPayload): Promise<Tenant[]> => {
  const { data } = await apiClient.v2.get<Tenant[]>(
    `/observability/resource/${resourceName}/metric/tenant`,
    {
      signal,
      params: iamTags
        ? {
            iamTags: JSON.stringify(iamTags),
          }
        : undefined,
    },
  );
  return data;
};

export const getTenantSubscriptions = async ({
  resourceName,
  tenantId,
  signal,
}: GetTenantPayload): Promise<TenantSubscription[]> => {
  const { data } = await apiClient.v2.get<TenantSubscription[]>(
    `/observability/resource/${resourceName}/metric/tenant/${tenantId}/subscription`,
    {
      signal,
    },
  );
  return data;
};

export const deleteTenantSubscription = async ({
  resourceName,
  tenantId,
  subscriptionId,
  signal,
}: DeleteTenantSubscriptionPayload): Promise<TenantSubscription> => {
  const { data } = await apiClient.v2.delete<TenantSubscription>(
    `/observability/resource/${resourceName}/metric/tenant/${tenantId}/subscription/${subscriptionId}`,
    { signal },
  );
  return data;
};
