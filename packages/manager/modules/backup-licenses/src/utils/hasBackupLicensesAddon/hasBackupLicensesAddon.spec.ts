import { describe, expect, it } from 'vitest';

import { Resource } from '@/types/Resource.type';
import { VspcTenant } from '@/types/VspcTenant.type';

import { hasBackupLicensesAddon } from './hasBackupLicensesAddon';

const buildVspcTenant = (currentState: Partial<VspcTenant>): Resource<VspcTenant> => ({
  id: 'vspc-1',
  resourceStatus: 'READY',
  currentState: { id: 'vspc-1', ...currentState },
});

describe('hasBackupLicensesAddon', () => {
  it('returns true when vspcType is ADVANCED and enabledAddons contains BACKUP_LICENSES', () => {
    const vspcTenant = buildVspcTenant({
      vspcType: 'ADVANCED',
      enabledAddons: ['BACKUP_LICENSES'],
    });

    expect(hasBackupLicensesAddon(vspcTenant)).toBe(true);
  });

  it('returns false when vspcType is not ADVANCED', () => {
    const vspcTenant = buildVspcTenant({
      vspcType: 'STANDARD',
      enabledAddons: ['BACKUP_LICENSES'],
    });

    expect(hasBackupLicensesAddon(vspcTenant)).toBe(false);
  });

  it('returns false when enabledAddons does not contain BACKUP_LICENSES', () => {
    const vspcTenant = buildVspcTenant({
      vspcType: 'ADVANCED',
      enabledAddons: ['OTHER_ADDON'],
    });

    expect(hasBackupLicensesAddon(vspcTenant)).toBe(false);
  });

  it('returns false when enabledAddons is missing', () => {
    const vspcTenant = buildVspcTenant({ vspcType: 'ADVANCED' });

    expect(hasBackupLicensesAddon(vspcTenant)).toBe(false);
  });
});
