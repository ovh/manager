import { nanoid } from 'nanoid';
import IMessageBus from '../message-bus/IMessageBus';

export interface IDeferred {
  resolve: (value: unknown | PromiseLike<unknown>) => void;
  reject: (reason?: unknown) => void;
}

interface IPluginResponse {
  uid: string;
  error?: unknown;
  success?: unknown;
}

export interface IPluginInvocation {
  plugin: string;
  method: string;
  args?: unknown[];
}

function iframeCheck() {
  if (!window.parent || window.parent === window.self) {
    window.location.href = '/';
  }
}

export default class ShellClient {
  deferredResponse: Record<string, IDeferred>;

  messageBus: IMessageBus;

  constructor(bus: IMessageBus) {
    this.deferredResponse = {};
    this.messageBus = bus;
    this.messageBus.onReceive((data: IPluginResponse) =>
      this.handleMessage(data),
    );
    iframeCheck();
  }

  getUniqueResponseId(): string {
    const uid = nanoid();
    return uid in this.deferredResponse ? this.getUniqueResponseId() : uid;
  }

  handleMessage(data: IPluginResponse): void {
    const deferred = this.deferredResponse[data.uid];
    if (deferred) {
      if ('error' in data) deferred.reject(data.error);
      else if ('success' in data) deferred.resolve(data.success);
      else deferred.reject();
      delete this.deferredResponse[data.uid];
    }
  }

  invokePluginMethod({
    plugin,
    method,
    args = [],
  }: IPluginInvocation): PromiseLike<unknown> {
    const uid = this.getUniqueResponseId();
    this.messageBus.send({
      uid,
      plugin,
      method,
      args,
    });
    return new Promise((resolve, reject) => {
      this.deferredResponse[uid] = { resolve, reject };
    });
  }
}
