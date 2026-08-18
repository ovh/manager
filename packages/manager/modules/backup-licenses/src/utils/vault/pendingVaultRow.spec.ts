import { describe, expect, it } from 'vitest';

import { PendingVaultRow, VaultResource } from '@/types/Vault.type';

import { isPendingVaultRow } from './pendingVaultRow';

describe('isPendingVaultRow', () => {
  it('recognizes a pending row', () => {
    const pending: PendingVaultRow = {
      id: 'pending-vault-1',
      resourceStatus: 'PENDING',
      currentState: { name: 'vault-1', region: 'eu-west-par' },
    };

    expect(isPendingVaultRow(pending)).toBe(true);
  });

  it('rejects a settled vault resource', () => {
    const vault = {
      id: 'vault-1',
      resourceStatus: 'READY',
      currentState: { name: 'vault-1', region: 'eu-west-par' },
    } as VaultResource;

    expect(isPendingVaultRow(vault)).toBe(false);
  });
});
