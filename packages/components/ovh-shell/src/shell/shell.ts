import PluginManager from './plugin-manager';
import MessageBus from '../message-bus';

export interface IPluginMessage {
  uid: string;
  plugin: string;
  method: string;
}

export default class Shell {
  pluginEventHandler: (event: MessageEvent) => void;

  pluginManager: PluginManager;

  messageBus: MessageBus;

  constructor() {
    this.messageBus = null;
    this.pluginManager = new PluginManager();
    this.pluginEventHandler = null;
  }

  getPluginManager() {
    return this.pluginManager;
  }

  handleMessage(data: IPluginMessage) {
    const onError = (error: Error) =>
      this.messageBus &&
      this.messageBus.send({
        uid: data.uid,
        error,
      });

    const onSuccess = (success: unknown) =>
      this.messageBus &&
      this.messageBus.send({
        uid: data.uid,
        success,
      });

    this.pluginManager
      .invokePluginMethod(data)
      .then(onSuccess)
      .catch(onError);
  }

  setMessageBus(bus: MessageBus) {
    this.messageBus = bus;
    this.messageBus.onReceive((data: IPluginMessage) =>
      this.handleMessage(data),
    );
    return this;
  }
}
