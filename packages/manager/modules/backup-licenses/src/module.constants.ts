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

export const MODULE_PRODUCT_LINE = 'BACKUP_LICENSES' as const;

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

/** Masque de la clé secrète : longueur fixe, pour ne pas révéler celle du secret (BKP-1222). */
export const VAULT_SECRET_MASK = '••••••••••••';

export const BACKUP_LICENSES_IAM_RULES = {
  'vault/edit': 'backupServices:apiovh:vault/edit',
  'vspc/edit': 'backupServices:apiovh:vspc/edit',
  'vspc/attach': 'backupServices:apiovh:vault/attach',
  'vspc/backupLicenses/delete': 'backupServices:apiovh:vspc/backupLicenses/delete',
  'vspc/backupLicenses/edit': 'backupServices:apiovh:vspc/backupLicenses/edit',
};

export const LOCAL_STORAGE_KEYS = {
  SHOW_NO_AGENT_ENABLED_MESSAGE: 'ovh-backup-licenses-show-no-agent-enabled-message',
  PENDING_ORDER: 'ovh-backup-licenses-pending-order',
};

export const PENDING_ORDER_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export const PENDING_ORDER_TIMEOUT_MS = 30 * 60 * 1000;

/**
 * Plan codes du stockage d'un vault Backup Licenses (§3.1 de la spec BKP-1225) : les deux
 * modes de facturation de l'offre — bundle 500 Go et paygo. Casse exacte non confirmée
 * côté Agora/BE (cf. §14 de la spec).
 */
export const BACKUP_LICENSES_VAULT_PLAN_CODES = [
  'backup-vault-backuplicenses-500g-consumption',
  'backup-vault-backuplicenses-paygo-consumption',
] as const;

/**
 * Plan code du seul mode de facturation qui inclut un volume de stockage gratuit
 * (les 500 premiers Go) : sert à distinguer, parmi les deux plan codes ci-dessus, le
 * vault concerné par `INCLUDED_VAULT_STORAGE_GB` — un vault paygo n'a aucun volume inclus.
 */
export const BACKUP_LICENSES_VAULT_BUNDLE_PLAN_CODE = BACKUP_LICENSES_VAULT_PLAN_CODES[0];

/** Volume de stockage inclus sur le vault en plan bundle (les 500 premiers Go). */
export const INCLUDED_VAULT_STORAGE_GB = 500;

/**
 * Plan code de l'offre COMMANDABLE d'un vault paygo supplémentaire (scénario Agora
 * *BackupLicenses-Order-3*) : celui-ci s'achète, les `BACKUP_LICENSES_VAULT_PLAN_CODES`
 * ci-dessus se facturent. ⭐️4 — doc de référencement Agora seulement, non confirmé par
 * l'API tant que le catalogue `backupServices` n'est pas déclaré.
 */
export const BACKUP_LICENSES_ORDERABLE_VAULT_PLAN_CODE = 'backup-vault-backuplicenses-paygo';

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
