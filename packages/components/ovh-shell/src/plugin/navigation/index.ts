import { Environment } from '@ovh-ux/manager-config';
import { buildURL } from '@ovh-ux/ufrontend';
import { ParamValueType } from '@ovh-ux/ufrontend/dist/types/url-builder';
import { ApplicationId } from '@ovh-ux/manager-config/types/application';

import ShellClient from '../../client/shell-client';

export interface navigationOptions {
  isTop?: boolean;
}

export interface ClientNavigationApi {
  getURL: (
    application: ApplicationId,
    path: string,
    params: Record<string, ParamValueType>,
  ) => PromiseLike<unknown>;
  navigateTo: (
    application: ApplicationId,
    path: string,
    params: Record<string, ParamValueType>,
    options: navigationOptions,
  ) => PromiseLike<unknown>;
  reload: (options: navigationOptions) => PromiseLike<unknown>;
}

export function navigation(environment: Environment) {
  const getPublicURL = (application: ApplicationId) => {
    const appPublicURL = environment.getApplications()[application]?.publicURL;
    const currentAppPublicURL = environment.getApplications()[
      environment.getApplicationName() as ApplicationId
    ]?.publicURL;

    if (appPublicURL === currentAppPublicURL) {
      return `${window.location.origin}${window.location.pathname}`;
    }

    return appPublicURL;
  };

  const getURL = (
    application: ApplicationId,
    path: string,
    params: Record<string, ParamValueType>,
  ): string => {
    return buildURL(getPublicURL(application), path, params);
  };

  const getWindow = (isTop = true) => {
    return isTop ? window.top : window;
  };

  return {
    getURL,
    navigateTo: (
      application: ApplicationId,
      path: string,
      params: Record<string, ParamValueType>,
      options: navigationOptions,
    ): void => {
      const windowToRefresh = getWindow(options.isTop);
      windowToRefresh.location.assign(getURL(application, path, params));
    },
    reload: (options: navigationOptions): void => {
      const windowToReload = getWindow(options.isTop);
      windowToReload.location.reload();
    },
  };
}

export function clientNavigation(
  shellClient: ShellClient,
): ClientNavigationApi {
  return {
    getURL: (
      application: ApplicationId,
      path: string,
      params: Record<string, ParamValueType>,
    ) =>
      shellClient.invokePluginMethod({
        plugin: 'navigation',
        method: 'getURL',
        args: [application, path, params],
      }),
    navigateTo: (
      application: ApplicationId,
      path: string,
      params: Record<string, ParamValueType>,
      options: navigationOptions,
    ) =>
      shellClient.invokePluginMethod({
        plugin: 'navigation',
        method: 'navigateTo',
        args: [application, path, params, options],
      }),
    reload: (options: navigationOptions) =>
      shellClient.invokePluginMethod({
        plugin: 'navigation',
        method: 'reload',
        args: [options],
      }),
  };
}

export default navigation;
