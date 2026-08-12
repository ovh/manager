import { VSPC_TENANTS_MOCKS } from '@/mocks/tenant/vspcTenants.mock';
import { Resource } from '@/types/Resource.type';
import { VSPCTenant } from '@/types/VspcTenant.type';

import { selectBackupAgentVspcTenants } from '../tenants.selectors';

const withState = (id: string, state: Partial<VSPCTenant>): Resource<VSPCTenant> => ({
  ...VSPC_TENANTS_MOCKS[0]!,
  id,
  currentState: { ...VSPC_TENANTS_MOCKS[0]!.currentState, id, ...state },
});

describe('selectBackupAgentVspcTenants', () => {
  it('keeps the tenants of the module product line', () => {
    expect(selectBackupAgentVspcTenants(VSPC_TENANTS_MOCKS)).toEqual(VSPC_TENANTS_MOCKS);
  });

  it('keeps only ours out of a mixed list', () => {
    const ours = VSPC_TENANTS_MOCKS[0]!;
    const theirs = withState('theirs', {
      vspcType: 'ADVANCED',
      enabledAddons: ['BACKUP_LICENSES'],
    });

    expect(selectBackupAgentVspcTenants([theirs, ours])).toEqual([ours]);
  });

  it.each([
    ['the add-on is missing', { vspcType: 'BASIC', enabledAddons: [] }],
    [
      'the type disagrees with the add-on',
      { vspcType: 'ADVANCED', enabledAddons: ['BACKUP_AGENT'] },
    ],
    ['neither discriminant is declared', { vspcType: undefined, enabledAddons: undefined }],
  ])('discards a tenant when %s', (_, state) => {
    expect(selectBackupAgentVspcTenants([withState('t', state)])).toEqual([]);
  });
});
