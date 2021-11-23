import React from 'react';
import Router, { hashChangeEvent } from './router';
import Application from './application';
import RoutingConfiguration from './configuration';
import ShellClient from '../../client/shell-client';

export function initRoutingConfiguration(routing: RoutingConfiguration) {
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

export function initRouting(iframe: HTMLIFrameElement) {
  const routingConfig = new RoutingConfiguration();
  const application = new Application(iframe, routingConfig);
  const router = <Router application={application} routing={routingConfig} />;

  initRoutingConfiguration(routingConfig);

  return {
    router,
    onHashChange: (): void => {
      window.dispatchEvent(new Event(hashChangeEvent));
    },
  };
}

export function routingClientApi(shellClient: ShellClient) {
  return {
    init: () =>
      window.addEventListener('hashchange', () => {
        if (window.parent !== window.self) {
          shellClient.invokePluginMethod({
            plugin: 'routing',
            method: 'onHashChange',
            args: [
              {
                hash: window.location.hash,
                path: window.location.pathname,
              },
            ],
          });
        }
      }),
  };
}
