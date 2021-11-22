import PluginManager from './plugin-manager';
import IMessageBus from '../message-bus/IMessageBus';
import {
  IShellMessage,
  IShellPluginInvocation,
  ShellMessageType,
} from '../common';

export default class Shell {
  pluginEventHandler: (event: MessageEvent) => void;

  pluginManager: PluginManager;

  messageBus: IMessageBus;

  constructor(bus: IMessageBus) {
    this.setMessageBus(bus);
    this.pluginManager = new PluginManager();
    this.pluginEventHandler = null;
  }

  setMessageBus(bus: IMessageBus) {
    this.messageBus = bus;
    this.messageBus.onReceive((data: IShellMessage<unknown>) => {
      if (data.type === ShellMessageType.PLUGIN_INVOCATION) {
        this.handlePluginMessage(data.message as IShellPluginInvocation);
      }
    });
  }

  getPluginManager() {
    return this.pluginManager;
  }

  emitEvent(eventId: string, data: unknown) {
    this.messageBus.send({
      type: ShellMessageType.EVENT,
      message: {
        eventId,
        data,
      },
    });
  }

  handlePluginMessage(data: IShellPluginInvocation) {
    const onError = (error: Error) =>
      this.messageBus &&
      this.messageBus.send({
        type: ShellMessageType.PLUGIN_RESULT,
        message: {
          uid: data.uid,
          error,
        },
      });

    const onSuccess = (success: unknown) =>
      this.messageBus &&
      this.messageBus.send({
        type: ShellMessageType.PLUGIN_RESULT,
        message: {
          uid: data.uid,
          success,
        },
      });

    this.pluginManager
      .invokePluginMethod(data as IShellPluginInvocation)
      .then(onSuccess)
      .catch(onError);
  }
}
