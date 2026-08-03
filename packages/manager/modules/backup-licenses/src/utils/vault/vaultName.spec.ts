import { describe, expect, it } from 'vitest';

import { validateVaultName } from './vaultName';

describe('validateVaultName', () => {
  it.each(['a', 'vault-prod-paris', 'Vault01', 'a'.repeat(50)])('accepts %s', (name) => {
    expect(validateVaultName(name)).toBeUndefined();
  });

  it('rejects an empty name', () => {
    expect(validateVaultName('')).toBe('required');
    expect(validateVaultName('   ')).toBe('required');
  });

  it('rejects a name over 50 characters', () => {
    expect(validateVaultName('a'.repeat(51))).toBe('length');
  });

  it.each(['vault_01', 'vault.01', "vault'01", 'vault 01', 'vault@01'])(
    'rejects %s on pattern',
    (name) => {
      expect(validateVaultName(name)).toBe('pattern');
    },
  );

  it('rejects the dot the S3 bucket rule would allow, since the ticket lists hyphens only', () => {
    expect(validateVaultName('my.vault')).toBe('pattern');
  });
});
