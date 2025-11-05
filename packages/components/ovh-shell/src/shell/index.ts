import { Environment } from '@ovh-ux/manager-config';

import Shell from './shell';
import DirectClientMessageBus from '../message-bus/direct-client';
import authenticationPlugin from '../plugin/auth';
import environmentPlugin from '../plugin/environment';
import navigationPlugin from '../plugin/navigation';
import routingPlugin from '../plugin/routing';
import { i18n as i18nPlugin } from '../plugin/i18n';
import { UXPlugin, UXPluginType } from '../plugin/ux';
import {
  TrackingPlugin,
  TrackingPluginType,
} from '../plugin/tracking/tracking';
import loggerPlugin from '../plugin/logger';
import { LocationPlugin, TLocationPlugin } from '../plugin/location';

function isStagingEnvironment() {
  return /\.dev$/.test(window.location.hostname);
}

export function initShell(): Shell {
  const shell = new Shell();

  // set message bus
  shell.setMessageBus(new DirectClientMessageBus());

  // register authentication plugin
  shell.getPluginManager().registerPlugin('auth', authenticationPlugin());

  // register environment plugin
  shell.getPluginManager().registerPlugin('routing', routingPlugin());

  // register ux plugin
  const uxPlugin = new UXPlugin(shell);
  shell
    .getPluginManager()
    .registerPlugin('ux', uxPlugin as UXPluginType<UXPlugin>);

  shell.getPluginManager().registerPlugin('logger', loggerPlugin());

  shell
    .getPluginManager()
    .registerPlugin('location', new LocationPlugin() as TLocationPlugin);

  return shell;
}

export function completeShellWithEnvironment(
  shell: Shell,
  environment: Environment,
) {
  if (isStagingEnvironment()) {
    Object.entries(environment.getApplications()).forEach(
      ([appName, appConfig]) => {
        const url = new URL(appConfig.publicURL);
        url.pathname = appConfig.container?.enabled
          ? '/container'
          : `/${appName}`;
        appConfig.publicURL = `${window.location.origin}${url.pathname}/${url.hash}`;
      },
    );
  }

  // register environment plugin
  shell
    .getPluginManager()
    .registerPlugin('environment', environmentPlugin(environment));

  // register i18n plugin
  shell
    .getPluginManager()
    .registerPlugin('i18n', i18nPlugin(shell, environment));

  // register navigation plugin
  shell
    .getPluginManager()
    .registerPlugin('navigation', navigationPlugin(environment));
  // Register Tracking plugin
  const trackingPlugin = new TrackingPlugin();

  trackingPlugin.configureTracking(
    environment.getRegion(),
    environment.getUser(),
    environment.getUserLocale(),
  );

  shell
    .getPluginManager()
    .registerPlugin(
      'tracking',
      trackingPlugin as TrackingPluginType<TrackingPlugin>,
    );
}

export function updateShellPlugins(shell: Shell, environment: Environment) {
  // register environment plugin
  shell
    .getPluginManager()
    .updatePluginInstance('environment', environmentPlugin(environment));

  shell
    .getPluginManager()
    .updatePluginInstance('navigation', navigationPlugin(environment));

  shell
    .getPluginManager()
    .getPlugin('tracking')
    .configureTracking(environment.getRegion(), environment.getUser());
}

export default {
  completeShellWithEnvironment,
  initShell,
  updateShellPlugins,
};
