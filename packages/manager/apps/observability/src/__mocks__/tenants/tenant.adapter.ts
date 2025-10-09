import { apiConfig } from '@/__mocks__/mock.config';
import { getTenants as getTenantsFromMock } from '@/__mocks__/tenants/tenant.mock';
import { getTenants as getTenantsFromApi } from '@/data/api/tenant';
import { Tenant } from '@/types/observability.type';

export const getTenants = async (serviceName: string, signal: AbortSignal): Promise<Tenant[]> => {
  const isMockEnabled = apiConfig.mode === 'mock';
  console.info('[MOCK-ADAPTER][getTenants] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? getTenantsFromMock(serviceName) : getTenantsFromApi(serviceName, signal);
};
