import { useReket } from '@ovh-ux/ovh-reket';
import {
  isTopLevelApplication,
  Application,
  ApplicationId,
} from '@ovh-ux/manager-config';
import { getHeaders } from '@ovh-ux/request-tagger';

import ShellClient from './shell-client';
import StandaloneShellClient from './standalone-shell-client';
import IFrameMessageBus from '../message-bus/iframe';
import { ShellClientApi } from './api';

function fetchApplications(): Promise<Record<string, Application>> {
  return useReket(true).get('/applications', {
    requestType: 'aapi',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json',
      ...getHeaders('/engine/2api/applications'),
    },
    credentials: 'same-origin',
  });
}

export const buildURLIfStandalone = (appConfig: Application) => {
  const queryParams = Object.fromEntries(
    new URLSearchParams(window.location.search).entries(),
  );
  // check for container redirection ...
  if (appConfig?.container?.enabled === true) {
    // ... but skip redirection if we are forcing standalone
    if (!queryParams.hasOwnProperty('standalone')) {
      const targetURL = new URL(appConfig.publicURL);
      const currentHash = window.location.hash;
      if (currentHash) {
        targetURL.hash = `${(targetURL.hash || '#').replace(
          /\/$/,
          '',
        )}/${currentHash.replace(/^#?\/?/, '')}`;
      }
      if (window.location.hostname !== 'localhost') {
        return targetURL.href;
      }
    }
  }

  return window.location.href;
};

export function initIFrameClientApi(appId: ApplicationId) {
  const client = new ShellClient();
  const clientApi = client.getApi();
  client.setApplicationId(appId);
  client.setMessageBus(new IFrameMessageBus());
  clientApi.routing.listenForHashChange();
  return Promise.resolve(clientApi);
}

export function initStandaloneClientApi(
  appId: ApplicationId,
  applications: Record<string, Application>,
) {
  let appConfig = applications[appId];
  if (!appConfig) {
    if (window.location.hostname === 'localhost') {
      appConfig = {
        container: {
          containerURL: '',
          enabled: false,
          isDefault: false,
          path: '',
        },
        publicURL: window.location.href,
        universe: 'hub',
        url: window.location.href,
      };
    } else {
      throw new Error(`Unknown application '${appId}'`);
    }
  }

  const url = buildURLIfStandalone(appConfig);
  if (window.location.href !== url) {
    window.location.href = url;
  }

  const client = new StandaloneShellClient();
  client.setApplicationId(appId);
  return client.init().then(() => client.getApi());
}

export default async function init(
  applicationId: ApplicationId,
): Promise<ShellClientApi> {
  let initPromise;

  if (isTopLevelApplication()) {
    initPromise = fetchApplications().then((apps) => {
      return initStandaloneClientApi(applicationId, apps);
    });
  } else {
    initPromise = initIFrameClientApi(applicationId);
  }

  return initPromise.then(async (shellApi) => {
    shellApi.ux.resetAccountSidebar();
    return shellApi.environment
      .setApplication(applicationId)
      .then(() => shellApi);
  });
}
