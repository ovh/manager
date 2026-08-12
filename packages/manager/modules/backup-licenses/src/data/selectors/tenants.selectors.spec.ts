import { describe, expect, it } from 'vitest';

import { buildBackupLicensesVspcTenant } from '@/mocks/tenants/tenants.mock';
import { Resource } from '@/types/Resource.type';
import { VspcTenant } from '@/types/VspcTenant.type';

import { selectBackupLicensesVspcTenants } from './tenants.selectors';

const buildTenant = (id: string, currentState: Partial<VspcTenant>): Resource<VspcTenant> => ({
  id,
  resourceStatus: 'READY',
  currentState: { id, ...currentState },
});

describe('selectBackupLicensesVspcTenants', () => {
  it('keeps a tenant declaring the add-on on the ADVANCED type', () => {
    const ours = buildBackupLicensesVspcTenant('ours');
    expect(selectBackupLicensesVspcTenants([ours])).toEqual([ours]);
  });

  it('keeps only ours out of a mixed list', () => {
    const ours = buildBackupLicensesVspcTenant('ours');
    const theirs = buildTenant('theirs', { vspcType: 'BASIC', enabledAddons: ['BACKUP_AGENT'] });
    expect(selectBackupLicensesVspcTenants([theirs, ours])).toEqual([ours]);
  });

  it.each([
    ['the add-on is missing', { vspcType: 'ADVANCED', enabledAddons: [] }],
    [
      'the type disagrees with the add-on',
      { vspcType: 'BASIC', enabledAddons: ['BACKUP_LICENSES'] },
    ],
    ['neither discriminant is declared', {}],
  ])('discards a tenant when %s', (_, currentState) => {
    expect(selectBackupLicensesVspcTenants([buildTenant('t', currentState)])).toEqual([]);
  });
});
