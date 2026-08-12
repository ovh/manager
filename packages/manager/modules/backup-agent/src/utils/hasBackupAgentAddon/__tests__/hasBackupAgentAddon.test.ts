import { VSPC_TENANTS_MOCKS } from '@/mocks/tenant/vspcTenants.mock';
import { Resource } from '@/types/Resource.type';
import { VSPCTenant } from '@/types/VspcTenant.type';

import { hasBackupAgentAddon } from '../hasBackupAgentAddon';

const withState = (state: Partial<VSPCTenant>): Resource<VSPCTenant> => ({
  ...VSPC_TENANTS_MOCKS[0]!,
  currentState: { ...VSPC_TENANTS_MOCKS[0]!.currentState, ...state },
});

describe('hasBackupAgentAddon', () => {
  it('is true when the add-on and the BASIC type agree', () => {
    expect(
      hasBackupAgentAddon(withState({ vspcType: 'BASIC', enabledAddons: ['BACKUP_AGENT'] })),
    ).toBe(true);
  });

  it('is true when our add-on sits beside the sibling one', () => {
    expect(
      hasBackupAgentAddon(
        withState({ vspcType: 'BASIC', enabledAddons: ['BACKUP_LICENSES', 'BACKUP_AGENT'] }),
      ),
    ).toBe(true);
  });

  it.each([
    [
      'the type is the sibling infrastructure',
      { vspcType: 'ADVANCED', enabledAddons: ['BACKUP_AGENT'] },
    ],
    ['the add-on is the sibling one', { vspcType: 'BASIC', enabledAddons: ['BACKUP_LICENSES'] }],
    ['no add-on is declared', { vspcType: 'BASIC', enabledAddons: [] }],
    ['neither field is declared', { vspcType: undefined, enabledAddons: undefined }],
  ])('is false when %s', (_, state) => {
    expect(hasBackupAgentAddon(withState(state))).toBe(false);
  });
});
