import { apiClient } from '@ovh-ux/manager-core-api';

import { ObservabilityServiceParams } from '@/data/api/observability.props';
import {
  CreateTenantsPayload,
  DeleteTenantSubscriptionPayload,
  EditTenantPayload,
  GetTenantPayload,
} from '@/data/api/tenants.props';
import { Tenant, TenantSubscription } from '@/types/tenants.type';

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

export const getTenant = async ({
  resourceName,
  tenantId,
  signal,
}: GetTenantPayload): Promise<Tenant> => {
  const { data } = await apiClient.v2.get<Tenant>(
    `/observability/resource/${resourceName}/metric/tenant/${tenantId}`,
    {
      signal,
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

export const deleteTenant = async (params: GetTenantPayload): Promise<Tenant> => {
  const { tenantId, resourceName, signal } = params;
  const { data: tenant } = await apiClient.v2.delete<Tenant>(
    `/observability/resource/${resourceName}/metric/tenant/${tenantId}`,
    { signal },
  );

  return tenant;
};
export const createTenants = async ({
  targetSpec,
  resourceName,
  signal,
}: CreateTenantsPayload): Promise<Tenant> => {
  const { data } = await apiClient.v2.post<Tenant>(
    `/observability/resource/${resourceName}/metric/tenant`,
    { targetSpec },
    { signal },
  );
  return data;
};

export const editTenant = async ({
  tenantId,
  resourceName,
  targetSpec,
}: EditTenantPayload): Promise<Tenant> => {
  const { data } = await apiClient.v2.put<Tenant>(
    `/observability/resource/${resourceName}/metric/tenant/${tenantId}`,
    { targetSpec },
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
