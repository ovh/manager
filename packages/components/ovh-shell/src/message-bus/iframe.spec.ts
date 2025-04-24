import { vi } from 'vitest';
import IFrameMessageBus from '../../src/message-bus/iframe';
import { IShellMessage } from '../common';

describe('Test iframe', () => {
  // workaround for https://github.com/jsdom/jsdom/issues/2745
  // found here: https://github.com/statechannels/statechannels/pull/2474
  // if no origin exists, replace with the test env location origin (localhost)
  window.addEventListener('message', (event: MessageEvent) => {
    if (event.origin === '') {
      event.stopImmediatePropagation();
      const eventWithOrigin: MessageEvent = new MessageEvent('message', {
        data: event.data,
        origin: 'http://localhost',
      });
      window.dispatchEvent(eventWithOrigin);
    }
  });

  it('Message bus sends a message with an iframe', () => {
    let iframeMessageBus: IFrameMessageBus;
    let success = false;
    let iframe: HTMLIFrameElement;
    const message = { id: 'test-message', type: 'test', message: 'test' };

    iframe = window.document.createElement('iframe');
    iframeMessageBus = new IFrameMessageBus(iframe);
    window.document.body.appendChild(iframe);
    iframe.contentWindow.addEventListener('message', (e) => {
      if (e.data.message.id === message.id) {
        success = true;
      }
    });

    iframeMessageBus.send(message);

    return new Promise<void>((resolve) => {
      // Set Timeout is necessary because we have to
      // wait for the listener to trigger
      setTimeout(() => {
        expect(success).toBeTruthy();
        resolve();
      }, 100);
    });
  });

  it('Message bus sends a message without iframe', () => {
    let iframeMessageBus: IFrameMessageBus;
    let success = false;
    const message = { id: 'test-message' };

    iframeMessageBus = new IFrameMessageBus();
    window.parent.addEventListener('message', (e) => {
      if (e.data.message.id === message.id) {
        success = true;
      }
    });

    iframeMessageBus.send((message as unknown) as IShellMessage<unknown>);

    return new Promise<void>((resolve) => {
      // Set Timeout is necessary because we have to
      // wait for the listener to trigger
      setTimeout(() => {
        expect(success).toBeTruthy();
        resolve();
      }, 100);
    });
  });

  it.skip('Message bus receives a message', () => {
    let iframeMessageBus: IFrameMessageBus;
    const log = vi.fn((entry) => entry);

    iframeMessageBus = new IFrameMessageBus();

    iframeMessageBus.onReceive(log);

    iframeMessageBus.send({
      id: 'test-id',
      type: 'test-type',
      message: 'test',
    } as IShellMessage<unknown>);

    return new Promise<void>((resolve) => {
      // Set Timeout is necessary because we have to
      // wait for the listener to trigger
      setTimeout(() => {
        console.log('coucou je suis dans la promesse');
        expect(log).toHaveBeenCalled();
        resolve();
      }, 10000);
    });
  });
});
