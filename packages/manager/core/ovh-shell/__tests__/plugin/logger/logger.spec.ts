import { loadFeature, defineFeature, DefineStepFunction } from 'jest-cucumber';

import logger from '../../../src/plugin/logger';

const feature = loadFeature('../../../features/plugin/logger/logger.feature', {
  loadRelativePath: true,
});

defineFeature(feature, (test) => {
  let loggerPlugin;

  afterEach(() => {
    localStorage.removeItem('MANAGER_SHELL_DEBUG');
  });

  // define i18n instanciation
  const givenLoggerPluginInstanciated = (given: DefineStepFunction) => {
    given('I have a logger plugin instanciated', () => {
      loggerPlugin = logger();
    });
  };

  const logSpy = jest.spyOn(console, 'log');
  const infoSpy = jest.spyOn(console, 'info');
  const warnSpy = jest.spyOn(console, 'warn');
  const errorSpy = jest.spyOn(console, 'error');

  test('Enable the plugin', ({ given, and, when, then }) => {
    const objectParam = {
      test: 'jest',
      foo: 'bar',
    };

    const errorParam = new Error('Log error');

    givenLoggerPluginInstanciated(given);

    and('debug flag is activated', () => {
      localStorage.setItem('MANAGER_SHELL_DEBUG', 'true');
    });

    when('I try to log, info, warn, error something', () => {
      loggerPlugin.log('log');
      loggerPlugin.info('info', objectParam);
      loggerPlugin.warn('warn');
      loggerPlugin.error('error', errorParam);
    });

    then('I should see the result in console', () => {
      expect(logSpy).toHaveBeenCalledWith('log');
      expect(infoSpy).toHaveBeenCalledWith('info', objectParam);
      expect(warnSpy).toHaveBeenCalledWith('warn');
      expect(errorSpy).toHaveBeenCalledWith('error', errorParam);
    });
  });

  test('Disable the plugin', ({ given, when, then }) => {
    givenLoggerPluginInstanciated(given);

    when('I try to log, info, warn, error something', () => {
      loggerPlugin.log('log');
      loggerPlugin.info('info');
      loggerPlugin.warn('warn');
      loggerPlugin.error('error');
    });

    then('I should not see anything in the console', () => {
      expect(logSpy).not.toHaveBeenCalled();
      expect(infoSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
      expect(errorSpy).not.toHaveBeenCalled();
    });
  });
});
