import Shell from './shell';
import IFrameMessageBus from '../message-bus/iframe';
import DirectClientMessageBus from '../message-bus/direct-client';

export function initShell() {
  const shell = new Shell(new DirectClientMessageBus());
  return {
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
}

export default { initShell };
