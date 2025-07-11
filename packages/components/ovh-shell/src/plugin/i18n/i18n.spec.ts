import { Environment, KeyPairName } from '@ovh-ux/manager-config';

import { i18n, I18nPlugin } from '../../../src/plugin/i18n';
import DirectClientMessageBus from '../../../src/message-bus/direct-client';
import Shell from '../../../src/shell/shell';

describe('Test i18n plugin', () => {
  let i18nPlugin: I18nPlugin;

  const shellMessageBus = new DirectClientMessageBus();
  const shell = new Shell();
  shell.setMessageBus(shellMessageBus);
  const environment = new Environment();

  it('Retrieving locale when nothing has changed', () => {
    let locale: string;
    i18nPlugin = i18n(shell, environment);
    locale = i18nPlugin.getLocale();
    expect(locale).toBe('en_GB');
  });

  it('Setting the locale', () => {
    i18nPlugin = i18n(shell, environment);
    i18nPlugin.setLocale('fr_FR');
    expect(i18nPlugin.getLocale()).toBe('fr_FR');
  });

  it('Getting the list of available locales', () => {
    let availableLocales: Array<KeyPairName>;
    i18nPlugin = i18n(shell, environment);
    availableLocales = i18nPlugin.getAvailableLocales();
    expect(availableLocales.length).toBeGreaterThan(0);
  });
});
