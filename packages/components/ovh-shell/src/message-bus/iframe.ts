import { IShellMessage } from '../common';
import IMessageBus from './IMessageBus';

const IFRAME_MESSAGE_TYPE = 'ovh-shell-iframe-message';

export default class IFrameMessageBus implements IMessageBus {
  iframe?: HTMLIFrameElement;

  listeners: CallableFunction[];

  onMessage: (event: MessageEvent) => void;

  constructor(iframe: HTMLIFrameElement = null) {
    this.iframe = iframe;
    this.listeners = [];
    this.onMessage = (event) => {
      // check if origins are the same
      if (event.origin !== window.location.origin) {
        return;
      }
      const { data } = event;
      if (data.type === IFRAME_MESSAGE_TYPE) {
        this.listeners.forEach((listener) => {
          listener(data.message);
        });
      }
    };
    window.addEventListener('message', this.onMessage);
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

  cleanup(): void {
    window.removeEventListener('message', this.onMessage);
    this.listeners = [];
  }
}
