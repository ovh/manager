import { useReket } from '@ovh-ux/ovh-reket';
import { isTopLevelApplication } from '@ovh-ux/manager-config';

import ShellClient from './shell-client';
import StandaloneShellClient from './standalone-shell-client';
import IFrameMessageBus from '../message-bus/iframe';
import exposeApi from './api';

interface ApplicationConfiguration {
  universe: string;
  url: string;
  standalone?: boolean;
  shellPath?: string;
}

function fetchApplications(): Promise<
  Record<string, ApplicationConfiguration>
> {
  return useReket(true).get('/applications', {
    requestType: 'aapi',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json',
    },
    credentials: 'same-origin',
  });
}

interface StandaloneApplicationResult {
  isStandalone: boolean;
  redirectionURL: string | null;
}

function isApplicationStandalone(
  apps: Record<string, ApplicationConfiguration>,
): Promise<StandaloneApplicationResult> {
  return new Promise<StandaloneApplicationResult>((resolve) => {
    Object.entries(apps).forEach(([, appConfig]) => {
      const urlWithoutHash = new URL(window.location.href);
      urlWithoutHash.hash = '';
      if (!appConfig.standalone && urlWithoutHash.href === appConfig.url) {
        const redirection = new URL(window.location.href);
        redirection.pathname = appConfig.shellPath;
        resolve({ isStandalone: false, redirectionURL: redirection.href });
      }
    });
    resolve({ isStandalone: true, redirectionURL: null });
  });
}

export default function init(applicationId: string) {
  if (isTopLevelApplication()) {
    return fetchApplications()
      .then(isApplicationStandalone)
      .then(({ isStandalone, redirectionURL }) => {
        if (!isStandalone) {
          window.location.href = redirectionURL;
        }
        return new StandaloneShellClient(applicationId)
          .init()
          .then((shellClient) => {
            return exposeApi(shellClient);
          });
      });
  }
  const shellClient = new ShellClient(new IFrameMessageBus());
  const shellClientApi = exposeApi(shellClient);
  shellClientApi.routing.init();
  return Promise.resolve(shellClientApi);
}
