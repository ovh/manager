import { describe, expect, it } from 'vitest';

import {
  BACKUP_SERVICES_ROUTE,
  getBackupServerRoute,
  getBackupServersRoute,
  getBackupServicesBaseRoute,
  getVspcTenantsRoute,
} from './apiRoutes';

describe('apiRoutes', () => {
  it('builds the backup services base route for a given tenant id', () => {
    expect(getBackupServicesBaseRoute('tenant-1')).toBe(`${BACKUP_SERVICES_ROUTE}/tenant-1`);
  });

  it('builds the vspc route for a given tenant id', () => {
    expect(getVspcTenantsRoute('tenant-1')).toBe(`${BACKUP_SERVICES_ROUTE}/tenant-1/vspc`);
  });

  it('builds the backup servers route for a given tenant and vspc tenant id', () => {
    expect(getBackupServersRoute('tenant-1', 'vspc-1')).toBe(
      `${BACKUP_SERVICES_ROUTE}/tenant-1/vspc/vspc-1/backupLicenses/backupServer`,
    );
  });

  it('builds the single backup server route for a given server id', () => {
    expect(getBackupServerRoute('tenant-1', 'vspc-1', 'server-1')).toBe(
      `${BACKUP_SERVICES_ROUTE}/tenant-1/vspc/vspc-1/backupLicenses/backupServer/server-1`,
    );
  });
});
