import { QueryClient } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getBackupServers } from '@/data/api/backupServers/backupServers.requests';
import { getBackupServicesTenants, getVspcTenants } from '@/data/api/tenants/tenants.requests';
import { BackupServicesTenant } from '@/types/BackupServicesTenant.type';
import { Resource } from '@/types/Resource.type';
import { VspcTenant } from '@/types/VspcTenant.type';

import { backupServersQueries } from './backupServers.queries';

vi.mock('@/data/api/backupServers/backupServers.requests');
vi.mock('@/data/api/tenants/tenants.requests');

const mockedGetBackupServers = vi.mocked(getBackupServers);
const mockedGetBackupServicesTenants = vi.mocked(getBackupServicesTenants);
const mockedGetVspcTenants = vi.mocked(getVspcTenants);

const buildResource = <T>(id: string, currentState: T): Resource<T> => ({
  id,
  resourceStatus: 'READY',
  currentState,
});

const createQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });

const fetchList = (queryClient: QueryClient) =>
  queryClient.fetchQuery(backupServersQueries.withClient(queryClient).list());

describe('backupServersQueries.list', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetBackupServers.mockResolvedValue([]);
  });

  it('requests the servers with the ids resolved by the cascade', async () => {
    mockedGetBackupServicesTenants.mockResolvedValue([
      buildResource<BackupServicesTenant>('service-1', { id: 'service-1', name: 'service' }),
    ]);
    mockedGetVspcTenants.mockResolvedValue([buildResource<VspcTenant>('vspc-1', { id: 'vspc-1' })]);

    await fetchList(createQueryClient());

    expect(mockedGetVspcTenants).toHaveBeenCalledWith('service-1');
    expect(mockedGetBackupServers).toHaveBeenCalledWith({
      backupServicesId: 'service-1',
      vspcTenantId: 'vspc-1',
    });
  });

  it('fails without requesting the servers when no service is found', async () => {
    mockedGetBackupServicesTenants.mockResolvedValue([]);

    await expect(fetchList(createQueryClient())).rejects.toThrow(
      'No Backup Licenses service found',
    );
    expect(mockedGetBackupServers).not.toHaveBeenCalled();
  });

  it('fails without requesting the servers when no VSPC tenant is found', async () => {
    mockedGetBackupServicesTenants.mockResolvedValue([
      buildResource<BackupServicesTenant>('service-1', { id: 'service-1', name: 'service' }),
    ]);
    mockedGetVspcTenants.mockResolvedValue([]);

    await expect(fetchList(createQueryClient())).rejects.toThrow('No VSPC tenant found');
    expect(mockedGetBackupServers).not.toHaveBeenCalled();
  });
});
