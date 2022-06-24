import { useReket } from '@ovh-ux/ovh-reket';
import { isTopLevelApplication } from '@ovh-ux/manager-config';
import {
  Application,
  ApplicationId,
} from '@ovh-ux/manager-config/types/application';

import ShellClient from './shell-client';
import StandaloneShellClient from './standalone-shell-client';
import IFrameMessageBus from '../message-bus/iframe';

function fetchApplications(): Promise<Record<string, Application>> {
  return useReket(true).get('/applications', {
    requestType: 'aapi',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json',
    },
    credentials: 'same-origin',
  });
}

export function initIFrameClientApi(appId: ApplicationId) {
  const client = new ShellClient();
  const clientApi = client.getApi();
  client.setApplicationId(appId);
  client.setMessageBus(new IFrameMessageBus());
  clientApi.routing.init();
  return Promise.resolve(clientApi);
}

export function initStandaloneClientApi(
  appId: ApplicationId,
  applications: Record<string, Application>,
) {
  const appConfig = applications[appId];
  if (!appConfig) {
    throw new Error(`Unknown application '${appId}'`);
  }

  // check for container redirection
  if (appConfig.container?.enabled === true) {
    const targetURL = new URL(appConfig.publicURL);
    const currentHash = window.location.hash;
    if (currentHash) {
      targetURL.hash = `${(targetURL.hash || '#').replace(
        /\/$/,
        '',
      )}/${currentHash.replace(/^#?\/?/, '')}`;
    }
    if (window.location.hostname !== 'localhost') {
      window.location.href = targetURL.href;
    }
  }

  const client = new StandaloneShellClient();
  client.setApplicationId(appId);
  return client.init().then(() => client.getApi());
}

export default function init(applicationId: ApplicationId) {
  let initPromise;

  if (isTopLevelApplication()) {
    initPromise = fetchApplications().then((apps) =>
      initStandaloneClientApi(applicationId, apps),
    );
  } else {
    initPromise = initIFrameClientApi(applicationId);
  }

  return initPromise.then((shellApi) => {
    shellApi.ux.resetAccountSidebar();
    return shellApi.environment
      .setApplication(applicationId)
      .then(() => shellApi);
  });
}
