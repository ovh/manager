import { MockInstance, vi } from 'vitest';
import logger from '../../../src/plugin/logger';

describe('Test logger', () => {
  let loggerPlugin;

  afterEach(() => {
    localStorage.removeItem('MANAGER_SHELL_DEBUG');
  });

  let logSpy: MockInstance;
  let infoSpy: MockInstance;
  let warnSpy: MockInstance;
  let errorSpy: MockInstance;
  let debugSpy: MockInstance;

  beforeEach(() => {
    // Créez les espions avant chaque test
    logSpy = vi.spyOn(console, 'log');
    infoSpy = vi.spyOn(console, 'info');
    warnSpy = vi.spyOn(console, 'warn');
    errorSpy = vi.spyOn(console, 'error');
    debugSpy = vi.spyOn(console, 'debug');
  });

  it('Enable the plugin', () => {
    const objectParam = {
      test: 'vi',
      foo: 'bar',
    };

    const errorParam = new Error('Log error');

    loggerPlugin = logger();

    localStorage.setItem('MANAGER_SHELL_DEBUG', 'true');

    loggerPlugin.log('log');
    loggerPlugin.info('info', objectParam);
    loggerPlugin.warn('warn');
    loggerPlugin.error('error', errorParam);
    loggerPlugin.debug('debug');

    expect(logSpy).toHaveBeenCalledWith('log');
    expect(infoSpy).toHaveBeenCalledWith('info', objectParam);
    expect(warnSpy).toHaveBeenCalledWith('warn');
    expect(errorSpy).toHaveBeenCalledWith('error', errorParam);
    expect(debugSpy).toHaveBeenCalledWith('debug');
  });

  it('Disable the plugin', () => {
    loggerPlugin = logger();
    localStorage.removeItem('MANAGER_SHELL_DEBUG');
    loggerPlugin.log('log');
    loggerPlugin.info('info');
    loggerPlugin.warn('warn');
    loggerPlugin.error('error');
    loggerPlugin.debug('debug');

    expect(logSpy).not.toHaveBeenCalled();
    expect(infoSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
    expect(debugSpy).not.toHaveBeenCalled();
  });
});
