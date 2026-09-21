import { QueryClient } from '@tanstack/react-query';

import { getBackupServices } from '@/data/api/backup/backupServices.requests';
import { getVSPCTenants } from '@/data/api/tenants/tenants.requests';
import { UnresolvableBackupAgentServiceError } from '@/data/errors/UnresolvableBackupAgentServiceError';
import { servicesQueries } from '@/data/queries/services.queries';
import { VSPC_TENANTS_MOCKS } from '@/mocks/tenant/vspcTenants.mock';
import { Resource } from '@/types/Resource.type';
import { Tenant } from '@/types/Tenant.type';
import { VSPCTenant } from '@/types/VspcTenant.type';

vi.mock('@/data/api/backup/backupServices.requests', () => ({
  getBackupServices: vi.fn(),
}));

vi.mock('@/data/api/tenants/tenants.requests', () => ({
  getVSPCTenants: vi.fn(),
}));

const backupService = (id: string) => ({ id }) as Resource<Tenant>;

const agentVspcTenant = VSPC_TENANTS_MOCKS[0]!;

const licensesVspcTenant: Resource<VSPCTenant> = {
  ...agentVspcTenant,
  currentState: {
    ...agentVspcTenant.currentState,
    vspcType: 'ADVANCED',
    enabledAddons: ['BACKUP_LICENSES'],
  },
};

const resolve = () => servicesQueries.withClient(new QueryClient()).backupServicesId();

describe('backupServicesId', () => {
  beforeEach(() => {
    vi.mocked(getVSPCTenants).mockReset();
  });

  it('returns the backup service holding a backup agent vspc tenant', async () => {
    vi.mocked(getBackupServices).mockResolvedValue([
      backupService('licenses'),
      backupService('agent'),
    ]);
    vi.mocked(getVSPCTenants).mockImplementation(({ backupServicesId }) =>
      Promise.resolve(backupServicesId === 'agent' ? [agentVspcTenant] : [licensesVspcTenant]),
    );

    await expect(resolve()).resolves.toBe('agent');
  });

  it('ignores a backup service whose vspc tenants cannot be listed', async () => {
    vi.mocked(getBackupServices).mockResolvedValue([
      backupService('forbidden'),
      backupService('agent'),
    ]);
    vi.mocked(getVSPCTenants).mockImplementation(({ backupServicesId }) =>
      backupServicesId === 'forbidden'
        ? Promise.reject(new Error('403'))
        : Promise.resolve([agentVspcTenant]),
    );

    await expect(resolve()).resolves.toBe('agent');
  });

  it('refuses to fall back on a sibling product service', async () => {
    vi.mocked(getBackupServices).mockResolvedValue([
      backupService('licenses'),
      backupService('other'),
    ]);
    vi.mocked(getVSPCTenants).mockResolvedValue([licensesVspcTenant]);

    await expect(resolve()).rejects.toThrow(UnresolvableBackupAgentServiceError);
  });

  it('throws when the customer holds no backup service', async () => {
    vi.mocked(getBackupServices).mockResolvedValue([]);

    await expect(resolve()).rejects.toThrow(UnresolvableBackupAgentServiceError);
  });
});
