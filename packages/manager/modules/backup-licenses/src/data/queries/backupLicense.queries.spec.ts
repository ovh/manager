import { QueryClient } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getBackupLicenses } from '@/data/api/backupLicenses/backupLicenses.requests';
import { getBackupServicesTenants, getVspcTenants } from '@/data/api/tenants/tenants.requests';
import { mockBackupLicenses } from '@/mocks/backupLicenses/backupLicenses.mock';
import { buildBackupLicensesVspcTenant } from '@/mocks/tenants/tenants.mock';
import { BackupServicesTenant } from '@/types/BackupServicesTenant.type';
import { Resource } from '@/types/Resource.type';

import { backupLicenseQueries } from './backupLicense.queries';

vi.mock('@/data/api/backupLicenses/backupLicenses.requests');
vi.mock('@/data/api/tenants/tenants.requests');

const mockedGetBackupLicenses = vi.mocked(getBackupLicenses);

const createQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('backupLicenseQueries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getBackupServicesTenants).mockResolvedValue([
      {
        id: 'service-1',
        resourceStatus: 'READY',
        currentState: { id: 'service-1', name: 'service' },
      } as Resource<BackupServicesTenant>,
    ]);
    vi.mocked(getVspcTenants).mockResolvedValue([buildBackupLicensesVspcTenant('vspc-1')]);
  });

  it('resolves the id of the first license found by the cascade', async () => {
    mockedGetBackupLicenses.mockResolvedValue(mockBackupLicenses);
    const queryClient = createQueryClient();

    const id = await backupLicenseQueries.withClient(queryClient).id();

    expect(id).toBe(mockBackupLicenses[0]!.id);
    expect(mockedGetBackupLicenses).toHaveBeenCalledWith({
      backupServicesId: 'service-1',
      vspcTenantId: 'vspc-1',
    });
  });

  it('resolves the resourceName of the first license found by the cascade', async () => {
    mockedGetBackupLicenses.mockResolvedValue(mockBackupLicenses);
    const queryClient = createQueryClient();

    const resourceName = await queryClient.fetchQuery(
      backupLicenseQueries.withClient(queryClient).resourceName(),
    );

    expect(resourceName).toBe(mockBackupLicenses[0]!.id);
  });

  it('shares the license list between id and resourceName instead of fetching it twice', async () => {
    mockedGetBackupLicenses.mockResolvedValue(mockBackupLicenses);
    const queryClient = createQueryClient();
    const licenses = backupLicenseQueries.withClient(queryClient);

    await queryClient.fetchQuery(licenses.resourceName());
    await licenses.id();

    expect(mockedGetBackupLicenses).toHaveBeenCalledTimes(1);
  });

  it('fails when no license is found', async () => {
    mockedGetBackupLicenses.mockResolvedValue([]);
    const queryClient = createQueryClient();

    await expect(backupLicenseQueries.withClient(queryClient).id()).rejects.toThrow(
      'No Backup License resource found',
    );
  });
});
