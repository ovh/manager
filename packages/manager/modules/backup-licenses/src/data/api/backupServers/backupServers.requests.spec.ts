import { AxiosInstance } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { v2 } from '@ovh-ux/manager-core-api';

import { BackupServerResource } from '@/types/BackupServer.type';
import { getBackupServersRoute } from '@/utils/apiRoutes/apiRoutes';

import { getBackupServers } from './backupServers.requests';

type MockableGet = Pick<AxiosInstance, 'get'>;

describe('getBackupServers', () => {
  const mockGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(v2 as unknown as MockableGet, { get: mockGet });
  });

  const params = {
    backupServicesId: 'service-1',
    vspcTenantId: 'vspc-1',
    backupLicensesId: 'license-1',
  };

  it('returns the servers from the API response', async () => {
    const servers = [{ id: 'server-1' }] as BackupServerResource[];
    mockGet.mockResolvedValue({ data: servers });

    const result = await getBackupServers(params);

    expect(mockGet).toHaveBeenCalledWith(getBackupServersRoute('service-1', 'vspc-1', 'license-1'));
    expect(result).toBe(servers);
  });

  it('treats a 404 as an empty server list', async () => {
    mockGet.mockRejectedValue({ response: { status: 404 } });

    await expect(getBackupServers(params)).resolves.toEqual([]);
  });

  it('rethrows non-404 errors', async () => {
    mockGet.mockRejectedValue(new Error('boom'));

    await expect(getBackupServers(params)).rejects.toThrow('boom');
  });
});
