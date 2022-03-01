import React from 'react';
import { Application as IApplication } from '@ovh-ux/manager-config/types/application';
import Router, { hashChangeEvent } from './router';
import Shell from '../../shell/shell';
import Application from './application';
import RoutingConfiguration from './configuration';

function initRoutingConfiguration(shell: Shell, routing: RoutingConfiguration) {
  if (window.location.hostname === 'localhost') {
    routing.addConfiguration({
      id: 'manager',
      path: '/app/',
    });
  } else {
    const environment = shell.getPlugin('environment').getEnvironment();
    Object.entries(environment.getApplications()).forEach(
      ([appId, appConfig]: [string, IApplication]) => {
        if (appConfig?.container?.path) {
          routing.addConfiguration({
            id: appId,
            path: `/${appConfig.container.path}/`,
          });
        }
      },
    );
  }
}

function initRouting(shell: Shell, iframe: HTMLIFrameElement) {
  const routingConfig = new RoutingConfiguration();
  const application = new Application(iframe, routingConfig);
  const router = <Router application={application} routing={routingConfig} />;

  initRoutingConfiguration(shell, routingConfig);

  return {
    router,
    onHashChange: (): void => {
      window.dispatchEvent(new Event(hashChangeEvent));
    },
  };
}

export default { initRouting, initRoutingConfiguration };
