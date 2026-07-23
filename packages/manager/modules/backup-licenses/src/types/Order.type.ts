/**
 * Domaine du tunnel de commande (BKP-1208).
 * Cf. spec apps/hpc-backup-licenses/spec/BKP-1208-order-funnel.md.
 */

/** Famille de licence choisie à l'étape 1. */
export enum LicenseFamily {
  ENTERPRISE_PLUS = 'ENTERPRISE_PLUS',
  DATA_PLATFORM = 'DATA_PLATFORM',
}

/** Niveau Veeam Data Platform choisi à l'étape 2 (uniquement si famille = DATA_PLATFORM). */
export enum VdpTier {
  FOUNDATION = 'FOUNDATION',
  ADVANCED = 'ADVANCED',
  PREMIUM = 'PREMIUM',
}

/**
 * Valeur d'énum envoyée à l'API (licenseType du POST).
 * NOTE: contrat API non figé (cf. spec) — valeurs issues du ticket, à confirmer BE.
 */
export enum LicenseApiValue {
  ENTERPRISE_PLUS = 'VEEAM_BACKUP_REPLICATION_ENTERPRISE_PLUS',
  VDP_FOUNDATION = 'VEEAM_DATA_PLATFORM_FOUNDATION',
  VDP_ADVANCED = 'VEEAM_DATA_PLATFORM_ADVANCED',
  VDP_PREMIUM = 'VEEAM_DATA_PLATFORM_PREMIUM',
}

/** Étapes possibles du wizard. L'ordre effectif dépend de la famille (cf. ORDER_STEPS_BY_FAMILY). */
export enum OrderStepId {
  LICENSE_TYPE = 'LICENSE_TYPE',
  VDP_TIER = 'VDP_TIER',
  SERVER_VAULT = 'SERVER_VAULT',
}

/**
 * Une feature listée dans une carte de licence.
 * NOTE couleur (décision 2026-07-23) : pas de violet, tout accent = `primary` ODS.
 * `highlight` met en avant la feature (check `primary` + libellé en gras) vs check `success` par défaut.
 */
export interface LicenseFeatureItem {
  /** Suffixe de clé i18n : `feature.<key>.label` / `feature.<key>.tooltip`. */
  key: string;
  /** Si vrai, feature mise en avant (accent primary + gras). */
  highlight?: boolean;
}

/** Carte de type de licence (étape 1). */
export interface LicenseCardData {
  family: LicenseFamily;
  /** Clé i18n racine de la carte (`license.<i18nKey>.*`). */
  i18nKey: string;
  recommended: boolean;
  /** Valeur API si la carte est directement commandable. Absente pour la carte parente DATA_PLATFORM. */
  apiValue?: LicenseApiValue;
  features: LicenseFeatureItem[];
}

/** Carte de niveau VDP (étape 2). */
export interface VdpTierCardData {
  tier: VdpTier;
  /** Clé i18n racine (`tier.<i18nKey>.*`). */
  i18nKey: string;
  recommended: boolean;
  apiValue: LicenseApiValue;
  features: LicenseFeatureItem[];
}

/** Région de provisionnement du Vault (étape 3). Stub en attendant le catalogue Agora. */
export interface VaultRegionData {
  /** Code API de la région (ex. `eu-west-par`). */
  apiValue: string;
  /** Emoji drapeau. */
  flag: string;
  /** Suffixe de clé i18n : `region.<i18nKey>.name` / `.zone`. */
  i18nKey: string;
}

/** État du formulaire du serveur VBR + Vault (étape 3). */
export interface ServerVaultFormState {
  displayName: string;
  backupServerExternalIp: string;
  isBehindNat: boolean;
  backupServerPrivateIp: string;
  vaultDisplayName: string;
  regionApiValue: string | null;
}
