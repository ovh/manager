export const BACKUP_TARIFF_URL = {
  ASIA:
    'https://www.ovhcloud.com/asia/enterprise/products/hosted-private-cloud/prices/',
  IN:
    'https://www.ovhcloud.com/en-in/enterprise/products/hosted-private-cloud/prices/',
  AU:
    'https://www.ovhcloud.com/en-au/enterprise/products/hosted-private-cloud/prices/',
  CA:
    'https://www.ovhcloud.com/en-ca/enterprise/products/hosted-private-cloud/prices/',
  CZ:
    'https://www.ovhcloud.com/en/enterprise/products/hosted-private-cloud/prices/',
  DE:
    'https://www.ovhcloud.com/de/enterprise/products/hosted-private-cloud/prices/',
  ES:
    'https://www.ovhcloud.com/es-es/enterprise/products/hosted-private-cloud/prices/',
  FI:
    'https://www.ovhcloud.com/en/enterprise/products/hosted-private-cloud/prices/',
  FR:
    'https://www.ovhcloud.com/fr/enterprise/products/hosted-private-cloud/prices/',
  GB:
    'https://www.ovhcloud.com/en-gb/enterprise/products/hosted-private-cloud/prices/',
  IE:
    'https://www.ovhcloud.com/en-ie/enterprise/products/hosted-private-cloud/prices/',
  IT:
    'https://www.ovhcloud.com/it/enterprise/products/hosted-private-cloud/prices/',
  LT:
    'https://www.ovhcloud.com/en/enterprise/products/hosted-private-cloud/prices/',
  MA:
    'https://www.ovhcloud.com/fr-ma/enterprise/products/hosted-private-cloud/prices/',
  NL:
    'https://www.ovhcloud.com/nl/enterprise/products/hosted-private-cloud/prices/',
  PL:
    'https://www.ovhcloud.com/pl/enterprise/products/hosted-private-cloud/prices/',
  PT:
    'https://www.ovhcloud.com/pt/enterprise/products/hosted-private-cloud/prices/',
  QC:
    'https://www.ovhcloud.com/fr-ca/enterprise/products/hosted-private-cloud/prices/',
  SG:
    'https://www.ovhcloud.com/en-sg/enterprise/products/hosted-private-cloud/prices/',
  SN:
    'https://www.ovhcloud.com/fr-sn/enterprise/products/hosted-private-cloud/prices/',
  TN:
    'https://www.ovhcloud.com/fr-tn/enterprise/products/hosted-private-cloud/prices/',
  US:
    'https://us.ovhcloud.com/products/hosted-private-cloud/managed-veeam-backup',
  WE:
    'https://www.ovhcloud.com/en/enterprise/products/hosted-private-cloud/prices/',
  WS:
    'https://www.ovhcloud.com/es/enterprise/products/hosted-private-cloud/prices/',
};

export const TRUSTED_ACCOUNT_BACKUP_TARIFF_URL = {
  FR:
    'https://www.ovhcloud.com/fr/enterprise/products/hosted-private-cloud/secnumcloud/prices/',
};

/**
 * Onboarding of Managed Backup for VMware in Manager v8, which replaces the
 * legacy Veeam Managed Backup offer (BKP-1758). Manager v8 has no entry in the
 * legacy application registry (coreURLBuilder / shell navigation.getURL only
 * know legacy applications), so it is reached by its path on the same origin,
 * like the container does for the other Manager v8 pages
 * (see container BETA_MANAGER_URL and the '/beta/#/web-cloud/...' links).
 */
export const MANAGED_BACKUP_FOR_VMWARE_URL =
  '/beta/#/private-cloud/managed-backup-for-vmware';

export default {
  BACKUP_TARIFF_URL,
  MANAGED_BACKUP_FOR_VMWARE_URL,
  TRUSTED_ACCOUNT_BACKUP_TARIFF_URL,
};
