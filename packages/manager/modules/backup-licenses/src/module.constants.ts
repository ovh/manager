import { ChangelogLinks } from '@ovh-ux/manager-react-components';

/**
 * Libellés produit non traduits (noms commerciaux).
 * Graphie de référence : « Backup Licenses » — cf. §11 de la spec BKP-1216.
 */
export const LABELS = {
  BACKUP_LICENSES: 'Backup Licenses',
  BACKUP_POLICY: 'Backup Policy',
  TENANTS: 'Tenants',
  VAULTS: 'Vaults',
  TENANT: 'Tenant',
  VAULT: 'Vault',
  VSPC: 'VSPC',
} as const;

/** Affiché à la place d'une valeur absente dans une cellule du tableau. */
export const EMPTY_VALUE_PLACEHOLDER = '—';

/** Polling des opérations asynchrones (BKP-1220) : 10 s d'intervalle, 5 min de garde-fou. */
export const POLLING_INTERVAL_MS = 10_000;
export const POLLING_TIMEOUT_MS = 300_000;

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

export const BACKUP_LICENSES_IAM_RULES = {
  'vault/edit': 'backupServices:apiovh:vault/edit',
  'vspc/edit': 'backupServices:apiovh:vspc/edit',
  'vspc/attach': 'backupServices:apiovh:vault/attach',
};

export const LOCAL_STORAGE_KEYS = {
  SHOW_NO_AGENT_ENABLED_MESSAGE: 'ovh-backup-licenses-show-no-agent-enabled-message',
};

export { NAMESPACE_PREFIX, BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';

// TODO(BKP-1206): placeholder — real tutorial URL not provided yet, replace once known.
export const TUTORIAL_DOC_URL = 'https://docs.ovh.com';

// Modèle : apps/hycu/src/constants.ts — même projet GitHub (16), filtré Backup and Disaster Recovery.
export const CHANGELOG_LINKS: ChangelogLinks = {
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Backup+and+Disaster+Recovery',
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Backup+and+Disaster+Recovery',
  'feature-request': 'https://github.com/ovh/private-cloud-roadmap/issues/new',
};
