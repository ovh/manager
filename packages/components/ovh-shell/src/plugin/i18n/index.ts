import { Environment, LANGUAGES } from '@ovh-ux/manager-config';
import { KeyPairName } from '@ovh-ux/manager-config/types/locale';

import ShellClient from '../../client/shell-client';
import Shell from '../../shell/shell';

export function i18n(shell: Shell, environment: Environment) {
  return {
    getLocale: (): string => environment.getUserLocale(),
    setLocale: (locale: string): void => {
      environment.setUserLocale(locale);
      shell.emitEvent('i18n:locale-change', { locale });
    },
    getAvailableLocales: (): Array<KeyPairName> => LANGUAGES.available,
  };
}

export function i18nClientApi(shellClient: ShellClient) {
  return {
    getLocale: () =>
      shellClient.invokePluginMethod({
        plugin: 'i18n',
        method: 'getLocale',
      }),
    onLocaleChange: (callback: CallableFunction) =>
      shellClient.addEventListener('i18n:locale-change', callback),
    setLocale: (locale: string) =>
      shellClient.invokePluginMethod({
        plugin: 'i18n',
        method: 'setLocale',
        args: [locale],
      }),
  };
}
