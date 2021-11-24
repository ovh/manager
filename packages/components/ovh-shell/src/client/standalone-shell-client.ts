import { initShell } from '../shell';
import Shell from '../shell/shell';
import ShellClient from './shell-client';
import DirectClientMessageBus from '../message-bus/direct-client';

export default class StandaloneShellClient extends ShellClient {
  private shell: Shell;

  init(): Promise<void> {
    return initShell().then((shellApi) => {
      this.shell = shellApi.getShell();
      const clientMessageBus = new DirectClientMessageBus();
      const shellMessageBus = new DirectClientMessageBus();

      clientMessageBus.addPeer(shellMessageBus);
      shellMessageBus.addPeer(clientMessageBus);

      this.shell.setMessageBus(shellMessageBus);
    });
  }
}
