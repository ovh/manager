export const VAULT_NAME_MIN_LENGTH = 1;
export const VAULT_NAME_MAX_LENGTH = 50;

/**
 * Ticket BKP-1223: "Min 1 char, max 50 chars. Alphanumeric and hyphens only." The create-vault
 * mockup shows a different rule (3-63 characters, lowercase boundaries, apostrophe) — the ticket is
 * the reference.
 */
export const VAULT_NAME_PATTERN = /^[a-zA-Z0-9-]+$/;

export type VaultNameError = 'required' | 'length' | 'pattern';

export const validateVaultName = (name: string): VaultNameError | undefined => {
  const value = name?.trim() ?? '';

  if (!value) return 'required';
  if (value.length > VAULT_NAME_MAX_LENGTH) return 'length';
  if (!VAULT_NAME_PATTERN.test(value)) return 'pattern';

  return undefined;
};
