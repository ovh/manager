import { nanoid } from 'nanoid';
import IMessageBus from '../message-bus/IMessageBus';
import {
  IShellEvent,
  IShellMessage,
  IShellPluginMethodCall,
  IShellPluginResult,
  ShellMessageType,
} from '../common';

export interface IDeferred {
  resolve: (value: unknown | PromiseLike<unknown>) => void;
  reject: (reason?: unknown) => void;
}

export default class ShellClient {
  deferredResponse: Record<string, IDeferred>;

  eventListeners: Record<string, CallableFunction[]>;

  messageBus: IMessageBus;

  constructor(bus: IMessageBus) {
    this.deferredResponse = {};
    this.eventListeners = {};
    this.messageBus = bus;
    this.messageBus.onReceive((data: IShellMessage<unknown>) => {
      if (data.type === ShellMessageType.EVENT) {
        const event = data.message as IShellEvent;
        const listeners = this.eventListeners[event.eventId] || [];
        listeners.forEach((listener) => listener(event.data));
      } else if (data.type === ShellMessageType.PLUGIN_RESULT) {
        this.handlePluginResult(data.message as IShellPluginResult);
      }
    });
  }

  getUniqueResponseId(): string {
    const uid = nanoid();
    return uid in this.deferredResponse ? this.getUniqueResponseId() : uid;
  }

  handlePluginResult(data: IShellPluginResult): void {
    const deferred = this.deferredResponse[data.uid];
    if (deferred) {
      if ('error' in data) deferred.reject(data.error);
      else if ('success' in data) deferred.resolve(data.success);
      else deferred.reject();
      delete this.deferredResponse[data.uid];
    }
  }

  addEventListener(eventId: string, callback: CallableFunction): void {
    if (!this.eventListeners[eventId]) {
      this.eventListeners[eventId] = [];
    }
    this.eventListeners[eventId].push(callback);
  }

  invokePluginMethod({
    plugin,
    method,
    args = [],
  }: IShellPluginMethodCall): PromiseLike<unknown> {
    const uid = this.getUniqueResponseId();
    this.messageBus.send({
      type: ShellMessageType.PLUGIN_INVOCATION,
      message: {
        uid,
        plugin,
        method,
        args,
      },
    });
    return new Promise((resolve, reject) => {
      this.deferredResponse[uid] = { resolve, reject };
    });
  }
}
