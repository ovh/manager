import { describe, expect, it, vi } from 'vitest';

import { getBackupServicesTenants, getVspcTenants } from '@/data/api/tenants/tenants.requests';
import { ApiError } from '@/types/ClientApi.type';

import { checkHasActiveBackupLicensesSubscription } from './checkHasActiveBackupLicensesSubscription';

vi.mock('@/data/api/tenants/tenants.requests');

const mockedGetBackupServicesTenants = vi.mocked(getBackupServicesTenants);
const mockedGetVspcTenants = vi.mocked(getVspcTenants);

describe('checkHasActiveBackupLicensesSubscription', () => {
  it('returns false when the tenant list is empty', async () => {
    mockedGetBackupServicesTenants.mockResolvedValue([]);

    await expect(checkHasActiveBackupLicensesSubscription()).resolves.toBe(false);
    expect(mockedGetVspcTenants).not.toHaveBeenCalled();
  });

  it('returns false when the tenant listing 404s', async () => {
    mockedGetBackupServicesTenants.mockRejectedValue({ response: { status: 404 } } as ApiError);

    await expect(checkHasActiveBackupLicensesSubscription()).resolves.toBe(false);
  });

  it('rethrows non-404 errors from the tenant listing', async () => {
    mockedGetBackupServicesTenants.mockRejectedValue(new Error('boom'));

    await expect(checkHasActiveBackupLicensesSubscription()).rejects.toThrow('boom');
  });

  it('returns true when a tenant has an active BACKUP_LICENSES vspc', async () => {
    mockedGetBackupServicesTenants.mockResolvedValue([
      { id: 'tenant-1', resourceStatus: 'READY', currentState: { id: 'tenant-1', name: 't1' } },
    ]);
    mockedGetVspcTenants.mockResolvedValue([
      {
        id: 'vspc-1',
        resourceStatus: 'READY',
        currentState: { id: 'vspc-1', vspcType: 'ADVANCED', enabledAddons: ['BACKUP_LICENSES'] },
      },
    ]);

    await expect(checkHasActiveBackupLicensesSubscription()).resolves.toBe(true);
  });

  it('returns false when no tenant has a matching vspc', async () => {
    mockedGetBackupServicesTenants.mockResolvedValue([
      { id: 'tenant-1', resourceStatus: 'READY', currentState: { id: 'tenant-1', name: 't1' } },
    ]);
    mockedGetVspcTenants.mockResolvedValue([
      {
        id: 'vspc-1',
        resourceStatus: 'READY',
        currentState: { id: 'vspc-1', vspcType: 'STANDARD', enabledAddons: [] },
      },
    ]);

    await expect(checkHasActiveBackupLicensesSubscription()).resolves.toBe(false);
  });
});
