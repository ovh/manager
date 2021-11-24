import { useReket } from '@ovh-ux/ovh-reket';
import { isTopLevelApplication } from '@ovh-ux/manager-config';

import ShellClient from './shell-client';
import StandaloneShellClient from './standalone-shell-client';
import IFrameMessageBus from '../message-bus/iframe';

interface ApplicationConfiguration {
  universe: string;
  url: string;
  useShell?: boolean;
  shellPath?: string;
  publicURL?: string;
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

function initIFrameClientApi(appId: string) {
  const client = new ShellClient();
  const clientApi = client.getApi();
  client.setApplicationId(appId);
  client.setMessageBus(new IFrameMessageBus());
  clientApi.routing.init();
  return Promise.resolve(clientApi);
}

function initStandaloneClientApi(appId: string) {
  return fetchApplications()
    .then((apps) => {
      const appConfig = apps[appId];
      if (!appConfig) {
        throw new Error(`Unknown application '${appId}'`);
      }
      if (appConfig.useShell) {
        window.location.href = appConfig.publicURL;
      }
    })
    .then(() => {
      const client = new StandaloneShellClient();
      client.setApplicationId(appId);
      return client.init().then(() => client.getApi());
    });
}

export default function init(applicationId: string) {
  if (isTopLevelApplication()) {
    return initStandaloneClientApi(applicationId);
  }
  return initIFrameClientApi(applicationId);
}
