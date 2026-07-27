import { EMPTY_VALUE_PLACEHOLDER } from '@/module.constants';

export type OsTypeDisplay = {
  /** Clé i18n du libellé (namespace `linked-servers`), absente si l'OS est inconnu. */
  i18nKey?: string;
  /** Libellé de repli : valeur brute de l'API, ou placeholder si elle est vide. */
  rawLabel: string;
};

/** `osType` est un enum majuscule côté API (`WINDOWS`, `LINUX`, …). */
const OS_TYPE_I18N_KEYS: Record<string, string> = {
  WINDOWS: 'os.windows',
  LINUX: 'os.linux',
};

/** Décrit comment afficher un `osType` renvoyé par l'API. */
export const getOsTypeDisplay = (osType?: string | null): OsTypeDisplay => {
  const value = osType?.trim();

  return {
    i18nKey: value ? OS_TYPE_I18N_KEYS[value] : undefined,
    rawLabel: value || EMPTY_VALUE_PLACEHOLDER,
  };
};
