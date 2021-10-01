import Shell from './shell';

export function initShell() {
  const shell = new Shell();
  return {
    connectApi: (iframe: HTMLIFrameElement) => shell.connectApi(iframe),
    disconnectApi: () => shell.disconnectApi(),
    registerPlugin: (
      pluginId: string,
      pluginApi: Record<string, CallableFunction>,
    ) => shell.getPluginManager().registerPlugin(pluginId, pluginApi),
    setPluginAvailability: (pluginId: string, availability: boolean) =>
      shell.getPluginManager().setPluginAvailability(pluginId, availability),
  };
}

export default { initShell };
