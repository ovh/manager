import { Environment, LANGUAGES } from '@ovh-ux/manager-config';
import { KeyPairName } from '@ovh-ux/manager-config/types/locale';

import Shell from '../../shell/shell';

export interface I18nPlugin {
  getLocale: () => string;
  setLocale: (locale: string) => void;
  getAvailableLocales: () => Array<KeyPairName>;
}

export function i18n(shell: Shell, environment: Environment): I18nPlugin {
  return {
    getLocale: (): string => environment.getUserLocale(),
    setLocale: (locale: string): void => {
      environment.setUserLocale(locale);
      shell.emitEvent('i18n:locale-change', { locale });
    },
    getAvailableLocales: (): Array<KeyPairName> => LANGUAGES.available,
  };
}
