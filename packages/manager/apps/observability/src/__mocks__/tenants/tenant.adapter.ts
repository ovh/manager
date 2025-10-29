import { apiConfig } from '@/__mocks__/mock.config';
import {
  deleteTenant as deleteTenantFromMock,
  getTenant as getTenantFromMock,
  getTenants as getTenantsFromMock,
} from '@/__mocks__/tenants/tenant.mock';
import { ObservabilityServiceParams } from '@/data/api/observability.props';
import {
  deleteTenant as deleteTenantFromApi,
  getTenant as getTenantFromApi,
  getTenants as getTenantsFromApi,
} from '@/data/api/tenants.api';
import { GetTenantPayload } from '@/data/api/tenants.props';
import { Tenant } from '@/types/tenants.type';

export const getTenants = async (params: ObservabilityServiceParams): Promise<Tenant[]> => {
  const isMockEnabled = apiConfig.mode === 'mock';
  console.info('[MOCK-ADAPTER][getTenants] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? getTenantsFromMock(params) : getTenantsFromApi(params);
};

export const getTenant = async (params: GetTenantPayload): Promise<Tenant> => {
  const isMockEnabled = apiConfig.mode === 'mock';
  console.info('[MOCK-ADAPTER][getTenant] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? getTenantFromMock(params) : getTenantFromApi(params);
};

export const deleteTenant = async (params: GetTenantPayload): Promise<Tenant> => {
  const isMockEnabled = apiConfig.mode === 'mock';
  console.info('[MOCK-ADAPTER][deleteTenant] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? deleteTenantFromMock(params) : deleteTenantFromApi(params);
};
