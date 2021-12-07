import { loadFeature, defineFeature, DefineStepFunction } from 'jest-cucumber';
import { Environment } from '@ovh-ux/manager-config';
import { KeyPairName } from '@ovh-ux/manager-config/types/locale';

import { i18n, I18nPlugin } from '../../../src/plugin/i18n';
import DirectClientMessageBus from '../../../src/message-bus/direct-client';
import Shell from '../../../src/shell/shell';

const feature = loadFeature('../../../features/plugin/i18n/i18n.feature', {
  loadRelativePath: true,
});

defineFeature(feature, (test) => {
  let i18nPlugin: I18nPlugin;

  const shellMessageBus = new DirectClientMessageBus();
  const shell = new Shell();
  shell.setMessageBus(shellMessageBus);
  const environment = new Environment();

  // define i18n instanciation
  const givenI18nPluginInstanciated = (given: DefineStepFunction) => {
    given('I have a i18n plugin instanciated', () => {
      i18nPlugin = i18n(shell, environment);
    });
  };

  test('Retrieving locale when nothing has changed', ({
    given,
    when,
    then,
  }) => {
    let locale: string;

    givenI18nPluginInstanciated(given);

    when('I try to get the locale', () => {
      locale = i18nPlugin.getLocale();
    });

    then('I should get the default locale', () => {
      expect(locale).toBe('en_GB');
    });
  });

  test('Setting the locale', ({ given, when, then }) => {
    givenI18nPluginInstanciated(given);

    when('I try to change the locale', () => {
      i18nPlugin.setLocale('fr_FR');
    });

    then('I should retrieve the setted locale', () => {
      expect(i18nPlugin.getLocale()).toBe('fr_FR');
    });
  });

  test('Getting the list of available locales', ({ given, when, then }) => {
    let availableLocales: Array<KeyPairName>;

    givenI18nPluginInstanciated(given);

    when('I try to get the list of available locales', () => {
      availableLocales = i18nPlugin.getAvailableLocales();
    });

    then('I should retrieve at least one available locale', () => {
      expect(availableLocales.length).toBeGreaterThan(0);
    });
  });
});
