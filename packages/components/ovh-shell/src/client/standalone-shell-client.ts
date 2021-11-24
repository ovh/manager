import { initShell } from '../shell';
import Shell from '../shell/shell';
import ShellClient from './shell-client';
import DirectClientMessageBus from '../message-bus/direct-client';
import plugin from '../plugin';

export default class StandaloneShellClient extends ShellClient {
  private applicationId: string;

  private shell: Shell;

  constructor(applicationId: string) {
    const clientMessageBus = new DirectClientMessageBus();
    const shellMessageBus = new DirectClientMessageBus();
    super(clientMessageBus);
    this.applicationId = applicationId;
    this.shell = new Shell(shellMessageBus);
    clientMessageBus.addPeer(shellMessageBus);
    shellMessageBus.addPeer(clientMessageBus);
  }

  init(): Promise<ShellClient> {
    return initShell(this.shell).then((shellApi) => {
      // @TODO set universe here when 2API configuration is patched
      // const environment = shellApi.getEnvironment();
      // environment.setUniverse();
      shellApi.registerPlugin(
        'i18n',
        plugin.i18n(this.shell, shellApi.getEnvironment()),
      );
      return this;
    });
  }
}
