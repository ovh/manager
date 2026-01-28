import { apiConfig } from '@/__mocks__/mock.config';
import {  
  deleteTenantSubscription as deleteTenantSubscriptionFromMock,  
  getTenantSubscriptions as getTenantSubscriptionsFromMock,
  getTenants as getTenantsFromMock,
} from '@/__mocks__/tenants/tenant.mock';
import { ObservabilityServiceParams } from '@/data/api/observability.props';
import {  
  deleteTenantSubscription as deleteTenantSubscriptionFromApi,  
  getTenantSubscriptions as getTenantSubscriptionsFromApi,
  getTenants as getTenantsFromApi,
} from '@/data/api/tenants.api';
import {  
  DeleteTenantSubscriptionPayload,  
  GetTenantPayload,
} from '@/data/api/tenants.props';
import { Tenant, TenantSubscription } from '@/types/tenants.type';

export const getTenants = async (params: ObservabilityServiceParams): Promise<Tenant[]> => {
  const isMockEnabled = apiConfig.tenant === 'mock';
  console.info('[MOCK-ADAPTER][getTenants] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? getTenantsFromMock(params) : getTenantsFromApi(params);
};

export const getTenantSubscriptions = async (
  params: GetTenantPayload,
): Promise<TenantSubscription[]> => {
  const isMockEnabled = apiConfig.tenantSubscription === 'mock';
  console.info('[MOCK-ADAPTER][getTenantSubscriptions] Mock enabled -> ', isMockEnabled);
  return isMockEnabled
    ? getTenantSubscriptionsFromMock(params)
    : getTenantSubscriptionsFromApi(params);
};

export const deleteTenantSubscription = async (
  params: DeleteTenantSubscriptionPayload,
): Promise<TenantSubscription> => {
  const isMockEnabled = apiConfig.tenantSubscription === 'mock';
  console.info('[MOCK-ADAPTER][deleteTenantSubscription] Mock enabled -> ', isMockEnabled);
  return isMockEnabled
    ? deleteTenantSubscriptionFromMock(params)
    : deleteTenantSubscriptionFromApi(params);
};
