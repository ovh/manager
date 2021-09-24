import Shell from './shell';

export default function initShell() {
  const shell = new Shell();
  return {
    connectApi: (iframe: HTMLIFrameElement) => shell.connectApi(iframe),
    disconnectApi: () => shell.disconnectApi(),
    registerPlugin: (pluginId: string, pluginApi: unknown) =>
      shell.getPluginManager().registerPlugin(pluginId, pluginApi),
    setPluginAvailability: (pluginId: string, availability: boolean) =>
      shell.getPluginManager().setPluginAvailability(pluginId, availability),
  };
}
