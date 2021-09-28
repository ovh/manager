import ShellClient from './shell-client';

export default function exposeApi(shell: ShellClient) {
  return {
    i18n: {
      getLocale: () =>
        shell.invokePluginMethod({
          plugin: 'i18n',
          method: 'getLocale',
        }),
    },
  };
}
