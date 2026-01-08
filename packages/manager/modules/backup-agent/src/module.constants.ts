export const LABELS = {
  BACKUP_AGENT: 'Backup Agent',
  BACKUP_POLICY: 'Backup Policy',
  TENANTS: 'Tenants',
  VAULTS: 'Vaults',
  TENANT: 'Tenant',
  VAULT: 'Vault',
} as const;

export const FEATURE_AVAILABILITY = Object.freeze({
  DELETE_TENANT: 'deleteTenant',
  DELETE_VAULT: 'deleteVault',
});

export const OS_LABELS = {
  LINUX: 'Linux',
  WINDOWS: 'Windows',
};

export const VAULT_PLAN_CODE = 'backup-vault-paygo-consumption';
