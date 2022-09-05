import { Environment } from '@ovh-ux/manager-config';
import { buildURL } from '@ovh-ux/url-builder';
import { ParamValueType } from '@ovh-ux/url-builder/dist/types/url-builder';
import { ApplicationId } from '@ovh-ux/manager-config/types/application';

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
      const configPublicURL = new URL(
        environment.getApplications()[application]?.publicURL,
      );
      publicURL.hash = configPublicURL.hash;
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
