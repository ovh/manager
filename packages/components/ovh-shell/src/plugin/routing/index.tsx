import React from 'react';
import { Application as IApplication } from '@ovh-ux/manager-config/types/application';
import { Redirect, Route } from 'react-router-dom';
import Router, { hashChangeEvent } from './router';
import Shell from '../../shell/shell';
import RoutingConfiguration from './configuration';
import Orchestrator, { AppChangeCallback } from './orchestrator';

export interface IRoutingOptions {
  onAppChange?: AppChangeCallback;
}

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
      ([, appConfig]: [string, IApplication]) => {
        /**
         * Application's id is a unique string identifier defined by container.path
         * It's used in the container's url to route requests to the corresponding application.
         */
        const appId = appConfig?.container?.path;
        if (appId) {
          if (appConfig?.container?.enabled) {
            try {
              const routingConfig = {
                id: appId,
                path: new URL(appConfig.url).pathname,
                publicURL: appConfig.publicURL,
              };
              routing.addConfiguration(routingConfig);
              if (appConfig.container.isDefault) {
                routing.setDefault(routingConfig);
              }
            } catch {
              // appConfig.url isn't a valid URL, ignore this config
            }
          } else {
            routing.addRedirection(appId, appConfig.publicURL);
          }
        }
      },
    );
    /**
     * If no routing configuration, redirect to the default application
     */
    if (!routing.hasDefault()) {
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

export function initRouting(
  shell: Shell,
  iframe: HTMLIFrameElement,
  options?: IRoutingOptions,
) {
  const routingConfig = new RoutingConfiguration();
  const routes: React.ReactElement<Route | Redirect>[] = [];

  initRoutingConfiguration(shell, routingConfig);

  const orchestrator = Orchestrator.create(
    routingConfig,
    iframe.contentWindow,
    window.top,
  );

  orchestrator.setCrossOriginErrorHandler(() => {
    const target = orchestrator.parseContainerURL().appURL?.href;
    if (target) {
      iframe.setAttribute('src', target);
    } else {
      orchestrator.redirectToContainerHome();
    }
  });

  orchestrator.onAppChangHandler((onAppChangeParams) => {
    shell.getPlugin('ux').showPreloader();
    options?.onAppChange?.(onAppChangeParams);
  });

  iframe.addEventListener('load', () => {
    shell.getPlugin('ux').showPreloader();
    try {
      iframe.contentWindow.location.toString();
    } catch {
      orchestrator.onCrossOriginError();
    }
  });

  const router = (
    <Router
      orchestrator={orchestrator}
      routing={routingConfig}
      routes={routes}
    />
  );

  return {
    router: () => router,
    addRoute: (route: React.ReactElement<Route | Redirect>): void => {
      routes.push(route);
    },
    onHashChange: (): void => {
      window.dispatchEvent(new Event(hashChangeEvent));
    },
    parseContainerURL: () => orchestrator.parseContainerURL(),
  };
}

export default { initRouting, initRoutingConfiguration };
