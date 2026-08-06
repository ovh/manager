import { beforeEach, describe, expect, it, vi } from 'vitest';

import { postJSON } from '@/data/api/Client.api';
import { CreateBackupLicenseBody } from '@/types/BackupLicense.type';
import { BackupServerResource } from '@/types/BackupServer.type';
import { getBackupLicensesRoute } from '@/utils/apiRoutes/apiRoutes';

import { createBackupLicense } from './backupLicenses.requests';

vi.mock('@/data/api/Client.api');

const mockedPostJSON = vi.mocked(postJSON);

describe('createBackupLicense', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('poste le corps sur la route backupLicenses du tenant VSPC résolu', async () => {
    const body: CreateBackupLicenseBody = {
      displayName: 'backup-prod',
      licenseType:
        'VEEAM_BACKUP_REPLICATION_ENTERPRISE_PLUS' as CreateBackupLicenseBody['licenseType'],
      backupServerExternalIp: ['185.26.17.45'],
    };
    const response = { id: 'server-1' } as BackupServerResource;
    mockedPostJSON.mockResolvedValue(response);

    const result = await createBackupLicense({
      backupServicesId: 'service-1',
      vspcTenantId: 'vspc-1',
      body,
    });

    expect(mockedPostJSON).toHaveBeenCalledWith(
      'v2',
      getBackupLicensesRoute('service-1', 'vspc-1'),
      body,
    );
    expect(result).toBe(response);
  });
});
