import { initShell } from '../shell';
import { Environment, fetchConfiguration } from '@ovh-ux/manager-config';
import Shell from '../shell/shell';
import ShellClient from './shell-client';
import DirectClientMessageBus from '../message-bus/direct-client';

export default class StandaloneShellClient extends ShellClient {
  private shell: Shell;

  init(): Promise<void> {
    return fetchConfiguration('shell').then((environment: Environment) => {
      this.shell = initShell(environment);
      const clientMessageBus = new DirectClientMessageBus();
      const shellMessageBus = new DirectClientMessageBus();

      clientMessageBus.addPeer(shellMessageBus);
      shellMessageBus.addPeer(clientMessageBus);

      this.setMessageBus(clientMessageBus);
      this.shell.setMessageBus(shellMessageBus);
    });
  }
}
