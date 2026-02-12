export const LABELS = {
  BACKUP_AGENT: 'Backup Agent',
  BACKUP_POLICY: 'Backup Policy',
  TENANTS: 'Tenants',
  VAULTS: 'Vaults',
  TENANT: 'Tenant',
  VAULT: 'Vault',
  VSPC: 'VSPC',
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
export const VAULT_DEFAULT_IMMUTABILITY = {
  duration: 14,
  encryption: 'SSE-OMK',
};

export const BACKUP_AGENT_IAM_RULES = {
  'vault/edit': 'backupServices:apiovh:vault/edit',
  'vspc/edit': 'backupServices:apiovh:vspc/edit',
  'vspc/attach': 'backupServices:apiovh:vault/attach',
};

export const LOCAL_STORAGE_KEYS = {
  SHOW_NO_AGENT_ENABLED_MESSAGE: 'ovh-backup-agent-show-no-agent-enabled-message',
};
