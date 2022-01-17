import { Environment, fetchConfiguration } from '@ovh-ux/manager-config';

import Shell from './shell';
import DirectClientMessageBus from '../message-bus/direct-client';
import authenticationPlugin from '../plugin/auth';
import environmentPlugin from '../plugin/environment';
import { i18n as i18nPlugin } from '../plugin/i18n';
import { UXPlugin, UXPluginType } from '../plugin/ux';
import {
  TrackingPlugin,
  TrackingPluginType,
} from '../plugin/tracking/tracking';

export function initShell(): Promise<Shell> {
  return fetchConfiguration('shell').then((environment: Environment) => {
    const shell = new Shell();

    // set message bus
    shell.setMessageBus(new DirectClientMessageBus());

    // register authentication plugin
    shell.getPluginManager().registerPlugin('auth', authenticationPlugin());

    // register environment plugin
    shell
      .getPluginManager()
      .registerPlugin('environment', environmentPlugin(environment));

    // register i18n plugin
    shell
      .getPluginManager()
      .registerPlugin('i18n', i18nPlugin(shell, environment));

    // register ux plugin
    const uxPlugin = new UXPlugin(shell);
    shell
      .getPluginManager()
      .registerPlugin('ux', uxPlugin as UXPluginType<UXPlugin>);

    // Register Tracking plugin
    const trackingPlugin = new TrackingPlugin();
    shell
      .getPluginManager()
      .registerPlugin(
        'tracking',
        trackingPlugin as TrackingPluginType<TrackingPlugin>,
      );

    return shell;
  });
}

export default { initShell };
