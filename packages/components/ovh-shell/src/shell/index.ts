import Shell from './shell';
import IFrameMessageBus from '../message-bus/iframe';

export function initShell() {
  const shell = new Shell();
  return {
    connectIFrameApplication: (iframe: HTMLIFrameElement) => {
      shell.setMessageBus(new IFrameMessageBus(iframe));
      return shell;
    },
    registerPlugin: (
      pluginId: string,
      pluginApi: Record<string, CallableFunction>,
    ) => shell.getPluginManager().registerPlugin(pluginId, pluginApi),
    setPluginAvailability: (pluginId: string, availability: boolean) =>
      shell.getPluginManager().setPluginAvailability(pluginId, availability),
  };
}

export default { initShell };
