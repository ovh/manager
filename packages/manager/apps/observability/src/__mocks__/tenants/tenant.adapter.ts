import { apiConfig } from '@/__mocks__/mock.config';
import {
  createTenant as createTenantsFromMock,
  deleteTenant as deleteTenantFromMock,
  deleteTenantSubscription as deleteTenantSubscriptionFromMock,
  editTenant as editTenantFromMock,
  getTenant as getTenantFromMock,
  getTenantSubscriptions as getTenantSubscriptionsFromMock,
  getTenants as getTenantsFromMock,
} from '@/__mocks__/tenants/tenant.mock';
import { ObservabilityServiceParams } from '@/data/api/observability.props';
import {
  createTenants as createTenantsFromApi,
  deleteTenant as deleteTenantFromApi,
  deleteTenantSubscription as deleteTenantSubscriptionFromApi,
  editTenant as editTenantFromApi,
  getTenant as getTenantFromApi,
  getTenantSubscriptions as getTenantSubscriptionsFromApi,
  getTenants as getTenantsFromApi,
} from '@/data/api/tenants.api';
import {
  CreateTenantsPayload,
  DeleteTenantSubscriptionPayload,
  EditTenantPayload,
  GetTenantPayload,
} from '@/data/api/tenants.props';
import { Tenant, TenantSubscription } from '@/types/tenants.type';

export const getTenants = async (params: ObservabilityServiceParams): Promise<Tenant[]> => {
  const isMockEnabled = apiConfig.tenant === 'mock';
  console.info('[MOCK-ADAPTER][getTenants] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? getTenantsFromMock(params) : getTenantsFromApi(params);
};

export const getTenant = async (params: GetTenantPayload): Promise<Tenant> => {
  const isMockEnabled = apiConfig.tenant === 'mock';
  console.info('[MOCK-ADAPTER][getTenant] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? getTenantFromMock(params) : getTenantFromApi(params);
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

export const deleteTenant = async (params: GetTenantPayload): Promise<Tenant> => {
  const isMockEnabled = apiConfig.tenant === 'mock';
  console.info('[MOCK-ADAPTER][deleteTenant] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? deleteTenantFromMock(params) : deleteTenantFromApi(params);
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

export const createTenants = async (payload: CreateTenantsPayload): Promise<Tenant> => {
  const isMockEnabled = apiConfig.tenant === 'mock';
  console.info('[MOCK-ADAPTER][createTenant] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? createTenantsFromMock(payload) : createTenantsFromApi(payload);
};

export const editTenant = async (payload: EditTenantPayload): Promise<Tenant> => {
  const isMockEnabled = apiConfig.tenant === 'mock';
  console.info('[MOCK-ADAPTER][editTenant] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? editTenantFromMock(payload) : editTenantFromApi(payload);
};
