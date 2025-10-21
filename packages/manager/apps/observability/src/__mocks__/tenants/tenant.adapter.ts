import { apiConfig } from '@/__mocks__/mock.config';
import {
  createTenant as createTenantsFromMock,
  getTenants as getTenantsFromMock,
} from '@/__mocks__/tenants/tenant.mock';
import { ObservabilityServiceParams } from '@/data/api/observability.props';
import {
  createTenants as createTenantsFromApi,
  getTenants as getTenantsFromApi,
} from '@/data/api/tenants.api';
import { CreateTenantsPayload } from '@/data/api/tenants.props';
import { Tenant } from '@/types/tenants.type';

export const getTenants = async (params: ObservabilityServiceParams): Promise<Tenant[]> => {
  const isMockEnabled = apiConfig.mode === 'mock';
  console.info('[MOCK-ADAPTER][getTenants] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? getTenantsFromMock(params) : getTenantsFromApi(params);
};

export const createTenants = async (payload: CreateTenantsPayload): Promise<Tenant> => {
  const isMockEnabled = apiConfig.mode === 'mock';
  console.info('[MOCK-ADAPTER][createTenant] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? createTenantsFromMock(payload) : createTenantsFromApi(payload);
};
