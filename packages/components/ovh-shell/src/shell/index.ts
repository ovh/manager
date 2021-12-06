import { Environment, fetchConfiguration } from '@ovh-ux/manager-config';

import Shell from './shell';
import DirectClientMessageBus from '../message-bus/direct-client';
import environmentPlugin from '../plugin/environment';

export function initShell(): Promise<Shell> {
  return fetchConfiguration('shell').then((environment: Environment) => {
    const shell = new Shell();

    // set message bus
    shell.setMessageBus(new DirectClientMessageBus());

    // register environment plugin
    shell
      .getPluginManager()
      .registerPlugin('environment', environmentPlugin(environment));

    return shell;
  });
}

export default { initShell };
