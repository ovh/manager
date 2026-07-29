import { describe, expect, it } from 'vitest';

import {
  BACKUP_SERVICES_ROUTE,
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
});
