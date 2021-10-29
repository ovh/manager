import Shell from './shell';
import IFrameMessageBus from '../message-bus/iframe';

export function initShell(iframe: HTMLIFrameElement) {
  const shell = new Shell(new IFrameMessageBus(iframe));
  return {
    emitEvent: (eventId: string, data: unknown): void =>
      shell.emitEvent(eventId, data),
    registerPlugin: (
      pluginId: string,
      pluginApi: Record<string, CallableFunction>,
    ) => shell.getPluginManager().registerPlugin(pluginId, pluginApi),
    setPluginAvailability: (pluginId: string, availability: boolean) =>
      shell.getPluginManager().setPluginAvailability(pluginId, availability),
  };
}

export default { initShell };
