import React from 'react';
import { Environment } from '@ovh-ux/manager-config';

import Router, { hashChangeEvent } from './router';
import Application from './application';
import RoutingConfiguration from './configuration';

function initRoutingConfiguration(
  routing: RoutingConfiguration,
  environment: Environment,
) {
  if (window.location.hostname === 'localhost') {
    routing.addConfiguration({
      id: 'manager',
      path: '/app/',
    });
  } else {
    const { applications } = environment;
    Object.entries(applications).forEach(([appName, appConfig]) => {
      if (appConfig.container.enabled) {
        const config = {
          id: appName,
          path: `/${appName}/`,
        };
        routing.addConfiguration(config);
        if (appConfig.container.isDefault) {
          routing.setDefault(config);
        }
      }
    });
  }
}

function initRouting(iframe: HTMLIFrameElement, environment: Environment) {
  const routingConfig = new RoutingConfiguration();
  const application = new Application(iframe, routingConfig);
  const router = <Router application={application} routing={routingConfig} />;

  initRoutingConfiguration(routingConfig, environment);

  return {
    router,
    onHashChange: (): void => {
      window.dispatchEvent(new Event(hashChangeEvent));
    },
  };
}

export default { initRouting, initRoutingConfiguration };
