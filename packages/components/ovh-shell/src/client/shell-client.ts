import { nanoid } from 'nanoid';

export interface IDeferred {
  resolve: (value: unknown | PromiseLike<unknown>) => void;
  reject: (reason?: unknown) => void;
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

  constructor() {
    this.deferredResponse = {};
    iframeCheck();
  }

  getUniqueResponseId(): string {
    const uid = nanoid();
    return uid in this.deferredResponse ? this.getUniqueResponseId() : uid;
  }

  handleEvent(event: MessageEvent): void {
    const { data } = event;
    if (data.type === 'ovh-shell-plugin-event') {
      const deferred = this.deferredResponse[data.uid];
      if (deferred) {
        if ('error' in data) deferred.reject(data.error);
        else if ('success' in data) deferred.resolve(data.success);
        else deferred.reject();
        delete this.deferredResponse[data.uid];
      }
    }
  }

  invokePluginMethod({
    plugin,
    method,
    args,
  }: IPluginInvocation): PromiseLike<unknown> {
    const uid = this.getUniqueResponseId();
    window.parent.postMessage({
      type: 'ovh-shell-plugin-event',
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
