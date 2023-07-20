import { Environment, ApplicationId } from '@ovh-ux/manager-config';
import { buildURL, ParamValueType } from '@ovh-ux/url-builder';

import ShellClient from '../../client/shell-client';

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
  ) => PromiseLike<unknown>;
  reload: () => PromiseLike<unknown>;
}

export function navigation(environment: Environment) {
  const getPublicURL = (application: ApplicationId) => {
    if (window.location.hostname === 'localhost') {
      const publicURL = new URL(window.location.href);
      const appPublicURL = environment.getApplications()[application]
        ?.publicURL;
      // if appPublicURL is not found it means were are refering an application not yet registered,
      // since we are in dev mode, simply build the publicURL from the application's id
      publicURL.hash = appPublicURL
        ? new URL(appPublicURL).hash
        : `/${application}`;
      return publicURL.href;
    }
    return environment.getApplications()[application]?.publicURL;
  };

  const getURL = (
    application: ApplicationId,
    path: string,
    params: Record<string, ParamValueType>,
  ): string => {
    return buildURL(getPublicURL(application), path, params);
  };

  return {
    getURL,
    navigateTo: (
      application: ApplicationId,
      path: string,
      params: Record<string, ParamValueType>,
    ): void => {
      (window.top || window).location.assign(getURL(application, path, params));
    },
    reload: (): void => {
      (window.top || window).location.reload();
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
    ) =>
      shellClient.invokePluginMethod({
        plugin: 'navigation',
        method: 'navigateTo',
        args: [application, path, params],
      }),
    reload: () =>
      shellClient.invokePluginMethod({
        plugin: 'navigation',
        method: 'reload',
        args: [],
      }),
  };
}

export default navigation;
