import { Environment, fetchConfiguration } from '@ovh-ux/manager-config';

import Shell from './shell';
import IFrameMessageBus from '../message-bus/iframe';
import DirectClientMessageBus from '../message-bus/direct-client';

interface IShell {
  getEnvironment: () => Environment;
  emitEvent: (eventId: string, data: unknown) => void;
  registerPlugin: (
    pluginId: string,
    pluginApi: Record<string, CallableFunction>,
  ) => void;
  setPluginAvailability: (pluginId: string, availability: boolean) => void;
  setIframeMessageBus: (iframe: HTMLIFrameElement) => void;
  i18n: () => unknown;
}

export function initShell(shellInstance?: Shell): Promise<IShell> {
  return fetchConfiguration('shell').then((environment: Environment) => {
    const shell = shellInstance || new Shell(new DirectClientMessageBus());
    return {
      getEnvironment: () => environment,
      emitEvent: (eventId: string, data: unknown): void =>
        shell.emitEvent(eventId, data),
      registerPlugin: (
        pluginId: string,
        pluginApi: Record<string, CallableFunction>,
      ) => shell.getPluginManager().registerPlugin(pluginId, pluginApi),
      setPluginAvailability: (pluginId: string, availability: boolean) =>
        shell.getPluginManager().setPluginAvailability(pluginId, availability),
      setIframeMessageBus: (iframe: HTMLIFrameElement) =>
        shell.setMessageBus(new IFrameMessageBus(iframe)),
      i18n: () => shell.getPluginManager().plugins.i18n.instance,
    };
  });
}

export default { initShell };
