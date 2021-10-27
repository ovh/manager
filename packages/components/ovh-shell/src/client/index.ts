import { useReket } from '@ovh-ux/ovh-reket';

import ShellClient from './shell-client';
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

function shellRedirection(
  apps: Record<string, ApplicationConfiguration>,
): void {
  Object.entries(apps).forEach(([, appConfig]) => {
    const urlWithoutHash = new URL(window.location.href);
    urlWithoutHash.hash = '';
    if (!appConfig.standalone && urlWithoutHash.href === appConfig.url) {
      const redirection = new URL(window.location.href);
      redirection.pathname = appConfig.shellPath;
      window.location.href = redirection.href;
    }
  });
}

function standaloneApplicationCheck() {
  return fetchApplications().then(shellRedirection);
}

export default function init() {
  standaloneApplicationCheck();
  const shell = new ShellClient(new IFrameMessageBus());
  return exposeApi(shell);
}
