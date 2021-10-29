import ShellClient from './shell-client';

export default function exposeApi(shellClient: ShellClient) {
  return {
    i18n: {
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
          args: [
            locale,
          ],
        }),
    },
    routing: {
      init: () =>
        window.addEventListener('hashchange', () => {
          if (window.parent !== window.self) {
            shellClient.invokePluginMethod({
              plugin: 'routing',
              method: 'onHashChange',
              args: [
                {
                  hash: window.location.hash,
                  path: window.location.pathname,
                },
              ],
            });
          }
        }),
    },
  };
}
