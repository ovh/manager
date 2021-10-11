const IFRAME_MESSAGE_TYPE = 'ovh-shell-iframe-message';

export default class IFrameMessageBus {
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

  send(message: unknown) {
    if (this.iframe) {
      this.iframe.contentWindow.postMessage({
        type: IFRAME_MESSAGE_TYPE,
        message,
      });
    } else {
      window.parent.postMessage({
        type: IFRAME_MESSAGE_TYPE,
        message,
      });
    }
  }

  onReceive(callback: CallableFunction) {
    this.listeners.push(callback);
  }
}
