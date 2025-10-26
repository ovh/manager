import { apiConfig } from '@/__mocks__/mock.config';
import { getTenants as getTenantsFromMock } from '@/__mocks__/tenants/tenant.mock';
import { ObservabilityServiceParams } from '@/data/api/observability.props';
import { getTenants as getTenantsFromApi } from '@/data/api/tenants.api';
import { Tenant } from '@/types/tenants.type';

export const getTenants = async (params: ObservabilityServiceParams): Promise<Tenant[]> => {
  const isMockEnabled = apiConfig.mode === 'mock';
  console.info('[MOCK-ADAPTER][getTenants] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? getTenantsFromMock(params) : getTenantsFromApi(params);
};
