import {
  LicenseApiValue,
  LicenseCardData,
  LicenseFamily,
  VdpTier,
  VdpTierCardData,
} from '@/types/Order.type';

// NOTE couleur (décision 2026-07-23) : pas de violet, tout accent = `primary` ODS.
// `highlight: true` = feature mise en avant (accent primary + gras).

/**
 * Catalogue HARDCODÉ des cartes de licence (contenu front, cf. spec BKP-1208).
 * Les libellés/tooltips/prix sont dans l'i18n (namespace `module-backup-licenses/order`).
 * Les prix réels viendront du catalogue Agora (API non figée) — tokens `██,██` en attendant.
 */

/** Étape 1 — cartes de type de licence. */
export const LICENSE_CARDS: LicenseCardData[] = [
  {
    family: LicenseFamily.ENTERPRISE_PLUS,
    i18nKey: 'enterprise_plus',
    recommended: false,
    apiValue: LicenseApiValue.ENTERPRISE_PLUS,
    features: [{ key: 'backup_restore' }, { key: 'vault_500' }, { key: 'security_base' }],
  },
  {
    family: LicenseFamily.DATA_PLATFORM,
    i18nKey: 'data_platform',
    recommended: true,
    // Carte parente : pas d'apiValue propre, déclenche l'étape 2 (le tier fournit l'enum).
    apiValue: undefined,
    // highlight = ce que Data Platform apporte en plus vs Enterprise Plus (features absentes de l'autre carte).
    features: [
      { key: 'backup_restore' },
      { key: 'vault_500' },
      { key: 'security_permissions', highlight: true },
      { key: 'cyber_ai', highlight: true },
      { key: 'orchestration', highlight: true },
    ],
  },
];

/** Étape 2 — cartes de niveau Veeam Data Platform. */
export const VDP_TIER_CARDS: VdpTierCardData[] = [
  {
    tier: VdpTier.FOUNDATION,
    i18nKey: 'foundation',
    recommended: false,
    apiValue: LicenseApiValue.VDP_FOUNDATION,
    features: [{ key: 'backup_restore' }, { key: 'vault_500' }, { key: 'security_permissions' }],
  },
  {
    tier: VdpTier.ADVANCED,
    i18nKey: 'advanced',
    recommended: false,
    apiValue: LicenseApiValue.VDP_ADVANCED,
    features: [
      { key: 'backup_restore' },
      { key: 'vault_500' },
      { key: 'security_permissions' },
      { key: 'cyber_ai', highlight: true },
    ],
  },
  {
    tier: VdpTier.PREMIUM,
    i18nKey: 'premium',
    recommended: true,
    apiValue: LicenseApiValue.VDP_PREMIUM,
    features: [
      { key: 'backup_restore' },
      { key: 'vault_500' },
      { key: 'security_permissions' },
      { key: 'cyber_ai' },
      { key: 'orchestration', highlight: true },
    ],
  },
];
