import ShellClient from '../../client/shell-client';

type LoggerFnType = 'log' | 'info' | 'warn' | 'error' | 'debug';

const LOCAL_STORAGE_KEY = 'MANAGER_SHELL_DEBUG';

function isDebugActivated() {
  const managerShellDebug = localStorage.getItem(LOCAL_STORAGE_KEY);
  return ['true', '1'].includes(managerShellDebug);
}

function consoleLogger(type: LoggerFnType) {
  const console = window.console || ({} as Console);
  const loggerFn = console[type] || console.log;

  return function log(...args: unknown[]) {
    return isDebugActivated()
      ? Function.prototype.apply.call(loggerFn, console, args)
      : undefined;
  };
}

function logger() {
  return {
    log: consoleLogger('log'),
    info: consoleLogger('info'),
    warn: consoleLogger('warn'),
    error: consoleLogger('error'),
    debug: consoleLogger('debug'),
  };
}

export function clientLogger(shellClient: ShellClient) {
  return {
    log: (...args: unknown[]) =>
      shellClient.invokePluginMethod({
        plugin: 'logger',
        method: 'log',
        args,
      }),
    info: (...args: unknown[]) =>
      shellClient.invokePluginMethod({
        plugin: 'logger',
        method: 'info',
        args,
      }),
    warn: (...args: unknown[]) =>
      shellClient.invokePluginMethod({
        plugin: 'logger',
        method: 'warn',
        args,
      }),
    error: (...args: unknown[]) =>
      shellClient.invokePluginMethod({
        plugin: 'logger',
        method: 'error',
        args,
      }),
    debug: (...args: unknown[]) =>
      shellClient.invokePluginMethod({
        plugin: 'logger',
        method: 'debug',
        args,
      }),
  };
}

export default logger;
