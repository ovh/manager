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
  const givenLoggerPluginInstantiated = (given: DefineStepFunction) => {
    given('I have a logger plugin instantiated', () => {
      loggerPlugin = logger();
    });
  };

  const logSpy = jest.spyOn(console, 'log');
  const infoSpy = jest.spyOn(console, 'info');
  const warnSpy = jest.spyOn(console, 'warn');
  const errorSpy = jest.spyOn(console, 'error');
  const debugSpy = jest.spyOn(console, 'debug');

  test('Enable the plugin', ({ given, and, when, then }) => {
    const objectParam = {
      test: 'jest',
      foo: 'bar',
    };

    const errorParam = new Error('Log error');

    givenLoggerPluginInstantiated(given);

    and('debug flag is activated', () => {
      localStorage.setItem('MANAGER_SHELL_DEBUG', 'true');
    });

    when('I try to log, info, warn, error, debug something', () => {
      loggerPlugin.log('log');
      loggerPlugin.info('info', objectParam);
      loggerPlugin.warn('warn');
      loggerPlugin.error('error', errorParam);
      loggerPlugin.debug('debug');
    });

    then('I should see the result in console', () => {
      expect(logSpy).toHaveBeenCalledWith('log');
      expect(infoSpy).toHaveBeenCalledWith('info', objectParam);
      expect(warnSpy).toHaveBeenCalledWith('warn');
      expect(errorSpy).toHaveBeenCalledWith('error', errorParam);
      expect(debugSpy).toHaveBeenCalledWith('debug');
    });
  });

  test('Disable the plugin', ({ given, when, then }) => {
    givenLoggerPluginInstantiated(given);

    when('I try to log, info, warn, error, debug something', () => {
      loggerPlugin.log('log');
      loggerPlugin.info('info');
      loggerPlugin.warn('warn');
      loggerPlugin.error('error');
      loggerPlugin.debug('debug');
    });

    then('I should not see anything in the console', () => {
      expect(logSpy).not.toHaveBeenCalled();
      expect(infoSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
      expect(errorSpy).not.toHaveBeenCalled();
      expect(debugSpy).not.toHaveBeenCalled();
    });
  });
});
