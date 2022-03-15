import React from 'react';
import { Route } from 'react-router-dom';
import Router, { hashChangeEvent } from './router';
import Application from './application';
import RoutingConfiguration from './configuration';

function initRoutingConfiguration(routing: RoutingConfiguration) {
  if (window.location.hostname === 'localhost') {
    routing.addConfiguration({
      id: 'manager',
      path: '/app/',
    });
  } else {
    ['hub', 'dedicated', 'web', 'public-cloud', 'telecom'].forEach(
      (manager) => {
        routing.addConfiguration({
          id: manager,
          path: `/${manager}/`,
        });
      },
    );
  }
}

function initRouting(iframe: HTMLIFrameElement) {
  const routingConfig = new RoutingConfiguration();
  const application = new Application(iframe, routingConfig);
  const routes: Route[] = [];
  const router = (
    <Router application={application} routing={routingConfig} routes={routes} />
  );

  initRoutingConfiguration(routingConfig);

  return {
    router,
    addRoute: (route: Route): void => {
      routes.push(route);
    },
    onHashChange: (): void => {
      window.dispatchEvent(new Event(hashChangeEvent));
    },
  };
}

export default { initRouting, initRoutingConfiguration };
