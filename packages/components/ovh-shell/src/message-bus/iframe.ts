import { IShellMessage } from '../common';
import IMessageBus from './IMessageBus';

const IFRAME_MESSAGE_TYPE = 'ovh-shell-iframe-message';

export default class IFrameMessageBus implements IMessageBus {
  iframe?: HTMLIFrameElement;

  listeners: CallableFunction[];

  constructor(iframe: HTMLIFrameElement = null) {
    this.iframe = iframe;
    this.listeners = [];
    window.addEventListener('message', (event) => {
      const { data } = event;
      if (data.type === IFRAME_MESSAGE_TYPE) {
        this.listeners.forEach((listener) => {
          listener(data.message);
        });
      }
    });
  }

  send<T>(message: IShellMessage<T>): void {
    if (this.iframe) {
      this.iframe.contentWindow.postMessage(
        {
          type: IFRAME_MESSAGE_TYPE,
          message,
        },
        window.location.origin,
      );
    } else {
      window.parent.postMessage(
        {
          type: IFRAME_MESSAGE_TYPE,
          message,
        },
        window.location.origin,
      );
    }
  }

  onReceive<T>(callback: (message: T) => void): void {
    this.listeners.push(callback);
  }
}
