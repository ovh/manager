import { Environment } from '@ovh-ux/manager-config';
import { buildURL } from '@ovh-ux/ufrontend';
import { ParamValueType } from '@ovh-ux/ufrontend/dist/types/url-builder';
import { ApplicationId } from '@ovh-ux/manager-config/types/application';

export interface navigateToOptions {
  isTop?: boolean;
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
      options: navigateToOptions,
    ): void => {
      const windowToRefresh = getWindow(options.isTop);
      windowToRefresh.location.assign(getURL(application, path, params));
    },
    reload: (isTop = true): void => {
      const windowToReload = getWindow(isTop);
      windowToReload.location.reload();
    },
  };
}

export default navigation;
