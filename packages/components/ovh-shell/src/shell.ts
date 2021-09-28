import PluginManager from './plugin-manager';

export default class Shell {
  iframe: HTMLIFrameElement;
  pluginEventHandler: (event: MessageEvent) => void;
  pluginManager: PluginManager;

  constructor() {
    this.iframe = null;
    this.pluginManager = new PluginManager();
    this.pluginEventHandler = null;
  }

  getPluginManager() {
    return this.pluginManager;
  }

  handleMessage(event: MessageEvent) {
    const { data } = event;
    if (data.type !== 'ovh-shell-plugin-event') return;

    const onError = (error: Error) =>
      this.iframe.contentWindow.postMessage({
        ...data,
        error,
      });

    const onSuccess = (success: unknown) =>
      this.iframe.contentWindow.postMessage({
        ...data,
        success,
      });

    this.pluginManager
      .invokePluginMethod(data)
      .then(onSuccess)
      .catch(onError);
  }

  connectApi(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
    this.pluginEventHandler = (event) => this.handleMessage(event);
    window.addEventListener('message', this.pluginEventHandler);
  }

  disconnectApi() {
    window.removeEventListener('message', this.pluginEventHandler);
    this.iframe = null;
  }
}
