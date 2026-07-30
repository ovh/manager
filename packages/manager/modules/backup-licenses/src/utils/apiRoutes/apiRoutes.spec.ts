import { describe, expect, it } from 'vitest';

import {
  BACKUP_SERVICES_ROUTE,
  getBackupLicensesRoute,
  getBackupServersRoute,
  getBackupServicesBaseRoute,
  getLicenseConsumptionRoute,
  getServiceConsumptionRoute,
  getVaultsRoute,
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

  it('builds the vaults route for a given tenant id', () => {
    expect(getVaultsRoute('tenant-1')).toBe(`${BACKUP_SERVICES_ROUTE}/tenant-1/vault`);
  });

  it('builds the backup licenses route for a given tenant id', () => {
    expect(getBackupLicensesRoute('tenant-1')).toBe(
      `${BACKUP_SERVICES_ROUTE}/tenant-1/backupLicenses`,
    );
  });

  it('builds the storage consumption route (/element) for a given service id', () => {
    expect(getServiceConsumptionRoute('service-1')).toBe('/services/service-1/consumption/element');
  });

  it('builds the license consumption route (no /element) for a given service id', () => {
    expect(getLicenseConsumptionRoute('service-1')).toBe('/services/service-1/consumption');
  });
});
