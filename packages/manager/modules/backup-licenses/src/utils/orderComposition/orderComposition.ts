import { LicenseApiValue, ServerVaultFormState } from '@/types/Order.type';
import { CartOfferOrderParameters } from '@/types/OrderCart.type';

/**
 * Scénario Agora *BackupLicenses-Order-1* (doc de référencement « 04 - New Veeam Enterprise
 * Agora »), client sans abonnement : le tenant, ses deux addons VSPC dans cet ordre, puis le
 * vault de 500 Go inclus dans l'offre. Aucun de ces plan codes n'est vérifiable tant que le
 * catalogue `backupServices` n'est pas déclaré (cf. spec order-subscription, R2).
 */
export const BACKUP_LICENSES_ORDER_PLAN_CODES = {
  tenant: 'backup-tenant',
  vspcTenant: 'vspc-tenant',
  vspcTenantLicenses: 'vspc-tenant-backuplicenses',
  bundledVault: 'backup-vault-backuplicenses-500G',
} as const;

/** La seule combinaison sourcée : celle du panier d'exemple de BKP-1208. */
const MONTHLY_UNIT = { duration: 'P1M', pricingMode: 'default', quantity: 1 };

export type BackupLicensesOrderComposition = {
  product: CartOfferOrderParameters;
  /** Dans l'ordre d'ajout au panier : un addon peut dépendre du précédent. */
  addons: CartOfferOrderParameters[];
  configurationValues: Record<string, string | undefined>;
};

/**
 * `configurationValues` n'est pas un corps de requête : c'est le vivier de valeurs apparié, à
 * l'exécution, aux labels que chaque item du panier déclare dans `requiredConfiguration`. Les noms
 * de labels sont ceux de la colonne « API field » du ticket ; la région, qu'aucune source ne nomme,
 * reprend la graphie des autres. Aucun n'est confirmé côté catalogue : un label réclamé qui
 * n'apparaît pas ici fait échouer la commande plutôt que d'être deviné.
 */
export const buildBackupLicensesOrderComposition = (
  form: ServerVaultFormState,
  licenseType: LicenseApiValue,
): BackupLicensesOrderComposition => ({
  product: { planCode: BACKUP_LICENSES_ORDER_PLAN_CODES.tenant, ...MONTHLY_UNIT },
  addons: [
    BACKUP_LICENSES_ORDER_PLAN_CODES.vspcTenant,
    BACKUP_LICENSES_ORDER_PLAN_CODES.vspcTenantLicenses,
    BACKUP_LICENSES_ORDER_PLAN_CODES.bundledVault,
  ].map((planCode) => ({ planCode, ...MONTHLY_UNIT })),
  configurationValues: {
    displayName: form.displayName.trim(),
    backupServerExternalIp: form.backupServerExternalIp.trim(),
    // R4 : NAT désactivé → l'IP privée est absente de la commande, pas envoyée vide.
    ...(form.isBehindNat ? { backupServerPrivateIp: form.backupServerPrivateIp.trim() } : {}),
    vaultDisplayName: form.vaultDisplayName.trim(),
    region: form.regionApiValue ?? undefined,
    licenseType,
  },
});
