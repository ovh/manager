import { EMPTY_VALUE_PLACEHOLDER } from '@/module.constants';
import { LicenseApiValue } from '@/types/Order.type';

export type LicenseTypeDisplay = {
  /** Clé i18n du libellé (namespace `linked-servers`), absente si le palier est inconnu. */
  i18nKey?: string;
  /**
   * Libellé de repli, utilisé quand `i18nKey` est absent : valeur brute de l'API, ou
   * placeholder si elle est vide. Si le BE ajoute un palier, la colonne reste informative.
   */
  rawLabel: string;
};

const LICENSE_TYPE_I18N_KEYS: Record<LicenseApiValue, string> = {
  [LicenseApiValue.VDP_FOUNDATION]: 'license.foundation',
  [LicenseApiValue.VDP_ADVANCED]: 'license.advanced',
  [LicenseApiValue.VDP_PREMIUM]: 'license.premium',
  [LicenseApiValue.ENTERPRISE_PLUS]: 'license.enterprise_plus',
};

/** Décrit comment afficher un `licenseType` renvoyé par l'API. */
export const getLicenseTypeDisplay = (licenseType?: string | null): LicenseTypeDisplay => {
  const value = licenseType?.trim();

  return {
    i18nKey: value ? LICENSE_TYPE_I18N_KEYS[value as LicenseApiValue] : undefined,
    rawLabel: value || EMPTY_VALUE_PLACEHOLDER,
  };
};
