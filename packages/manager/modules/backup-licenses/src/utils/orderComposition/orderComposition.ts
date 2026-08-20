import { LicenseApiValue, ServerVaultFormState } from '@/types/Order.type';
import { toIpBlock } from '@/utils/formatIpList/formatIpList';

/** Relevés sur le catalogue `backupServices` de labeu (catalogId 3190, 2026-08-06). */
export const BACKUP_LICENSES_ORDER_PLAN_CODES = {
  tenant: 'backup-tenant',
  vspcTenant: 'vspc-tenant',
  vspcTenantLicenses: 'vspc-tenant-backuplicenses',
  bundledVault: 'backup-vault-backuplicenses-500G',
} as const;

/**
 * Relevés item par item sur un panier réel : le catalogue public les déclare sous
 * `products[].configurations` avec `values: null`, donc ni les labels ni leurs valeurs légales
 * ne se découvrent depuis le front.
 */
export const BACKUP_LICENSES_CONFIGURATION_LABELS = {
  backupServerDisplayName: 'backupserver-displayname',
  backupServerPublicIp: 'backupserver-public-ip',
  backupServerPrivateIp: 'backupserver-private-ip',
  licenseType: 'license-type',
  vaultAzName: 'vault-azname',
  vaultName: 'vault-name',
} as const;

/**
 * La composition est un arbre, pas une liste : le panier n'offre un addon que sous son parent —
 * `vspc-tenant-backuplicenses` n'apparaît que dans les options de `vspc-tenant`, jamais dans
 * celles du tenant. Rattaché au mauvais parent, il n'est pas commandable.
 */
export type BackupLicensesOrderNode = {
  planCode: string;
  /** Dans l'ordre d'ajout au panier : un addon peut dépendre du précédent. */
  options: BackupLicensesOrderNode[];
};

export type BackupLicensesOrderComposition = {
  product: BackupLicensesOrderNode;
  configurationValues: Record<string, string | undefined>;
};

/**
 * `configurationValues` n'est pas un corps de requête : c'est le vivier apparié, à l'exécution, aux
 * labels que chaque item déclare dans `requiredConfiguration`.
 */
export const buildBackupLicensesOrderComposition = (
  form: ServerVaultFormState,
  licenseType: LicenseApiValue,
): BackupLicensesOrderComposition => ({
  product: {
    planCode: BACKUP_LICENSES_ORDER_PLAN_CODES.tenant,
    options: [
      {
        planCode: BACKUP_LICENSES_ORDER_PLAN_CODES.vspcTenant,
        options: [{ planCode: BACKUP_LICENSES_ORDER_PLAN_CODES.vspcTenantLicenses, options: [] }],
      },
      { planCode: BACKUP_LICENSES_ORDER_PLAN_CODES.bundledVault, options: [] },
    ],
  },
  configurationValues: {
    [BACKUP_LICENSES_CONFIGURATION_LABELS.backupServerDisplayName]: form.displayName.trim(),
    [BACKUP_LICENSES_CONFIGURATION_LABELS.backupServerPublicIp]: toIpBlock(
      form.backupServerExternalIp.trim(),
    ),
    // NAT désactivé : l'IP privée est absente de la commande, pas envoyée vide.
    ...(form.isBehindNat
      ? {
          [BACKUP_LICENSES_CONFIGURATION_LABELS.backupServerPrivateIp]: toIpBlock(
            form.backupServerPrivateIp.trim(),
          ),
        }
      : {}),
    [BACKUP_LICENSES_CONFIGURATION_LABELS.licenseType]: licenseType,
    [BACKUP_LICENSES_CONFIGURATION_LABELS.vaultAzName]: form.regionApiValue ?? undefined,
    [BACKUP_LICENSES_CONFIGURATION_LABELS.vaultName]: form.vaultDisplayName.trim(),
  },
});
