import React from 'react';
import { Application as IApplication } from '@ovh-ux/manager-config/types/application';
import { Redirect, Route } from 'react-router-dom';
import Router, { hashChangeEvent } from './router';
import Shell from '../../shell/shell';
import Application from './application';
import RoutingConfiguration from './configuration';

export function initRoutingConfiguration(
  shell: Shell,
  routing: RoutingConfiguration,
) {
  if (window.location.hostname === 'localhost') {
    routing.addConfiguration({
      id: 'manager',
      path: '/app/',
    });
  } else {
    /**
     * Initialize routing configuration
     */
    const environment = shell.getPlugin('environment').getEnvironment();
    Object.entries(environment.getApplications()).forEach(
      ([appId, appConfig]: [string, IApplication]) => {
        if (appConfig?.container?.enabled && appConfig?.container?.path) {
          const routingConfig = {
            id: appId,
            path: `/${appConfig.container.path}/`,
            publicURL: appConfig.publicURL,
          };
          routing.addConfiguration(routingConfig);
          if (appConfig.container.isDefault) {
            routing.setDefault(routingConfig);
          }
        }
      },
    );
    /**
     * If no routing configuration, redirect to the default application
     */
    if (!routing.getDefault()) {
      let redirect = false;
      Object.entries(environment.getApplications()).forEach(
        ([, appConfig]: [string, IApplication]) => {
          if (appConfig?.container?.isDefault) {
            redirect = true;
            window.top.location.href = appConfig.publicURL;
          }
        },
      );
      if (!redirect) {
        throw new Error('Missing default application in configuration');
      }
    }
  }
}

export function initRouting(shell: Shell, iframe: HTMLIFrameElement) {
  const routingConfig = new RoutingConfiguration();
  const application = new Application(iframe, routingConfig);
  const routes: React.ReactElement<Route | Redirect>[] = [];
  const router = (
    <Router application={application} routing={routingConfig} routes={routes} />
  );

  initRoutingConfiguration(shell, routingConfig);

  return {
    router,
    addRoute: (route: React.ReactElement<Route | Redirect>): void => {
      routes.push(route);
    },
    onHashChange: (): void => {
      window.dispatchEvent(new Event(hashChangeEvent));
    },
  };
}

export default { initRouting, initRoutingConfiguration };
