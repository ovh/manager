export const NAMESPACE_PREFIX = 'module-backup-licenses';

export const BACKUP_LICENSES_NAMESPACES = {
  ONBOARDING: `${NAMESPACE_PREFIX}/onboarding`,
  ORDER: `${NAMESPACE_PREFIX}/order`,
  DASHBOARD: `${NAMESPACE_PREFIX}/dashboard`,
  LINKED_SERVERS: `${NAMESPACE_PREFIX}/linked-servers`,
};

/**
 * Libellés produit non traduits (noms commerciaux).
 * Graphie de référence : « Backup Licenses » — cf. §11 de la spec BKP-1216.
 */
export const LABELS = {
  BACKUP_LICENSES: 'Backup Licenses',
} as const;

/** Affiché à la place d'une valeur absente dans une cellule du tableau. */
export const EMPTY_VALUE_PLACEHOLDER = '—';

/** Polling des opérations asynchrones (BKP-1220) : 10 s d'intervalle, 5 min de garde-fou. */
export const POLLING_INTERVAL_MS = 10_000;
export const POLLING_TIMEOUT_MS = 300_000;

// TODO(BKP-1206): placeholder — real tutorial URL not provided yet, replace once known.
export const TUTORIAL_DOC_URL = 'https://docs.ovh.com';
