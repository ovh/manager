import { loadFeature, defineFeature } from 'jest-cucumber';
import DirectClientMessageBus from '../../src/message-bus/direct-client';
import IFrameMessageBus from '../../src/message-bus/iframe';

const feature = loadFeature('../../features/message-bus/iframe.feature', {
  loadRelativePath: true,
});

defineFeature(feature, (test) => {
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

  test('Message bus sends a message with an iframe', ({
    given,
    when,
    then,
  }) => {
    let iframeMessageBus: IFrameMessageBus;
    let success = false;
    let iframe: HTMLIFrameElement;
    const message = { id: 'test-message' };

    given('My message bus has an iframe', () => {
      iframe = window.document.createElement('iframe');
      iframeMessageBus = new IFrameMessageBus(iframe);
      window.document.body.appendChild(iframe);
      iframe.contentWindow.addEventListener('message', (e) => {
        if (e.data.message.id === message.id) {
          success = true;
        }
      });
    });

    when('The message bus sends a message', () => {
      iframeMessageBus.send(message);
    });

    then('The message should be usable through the event Message', () => {
      return new Promise<void>((resolve) => {
        // Set Timeout is necessary because we have to
        // wait for the listener to trigger
        setTimeout(() => {
          expect(success).toBeTruthy();
          resolve();
        }, 100);
      });
    });
  });

  test('Message bus sends a message without iframe', ({
    given,
    when,
    then,
  }) => {
    let iframeMessageBus: IFrameMessageBus;
    let success = false;
    const message = { id: 'test-message' };
    given('My message bus has no iframe', () => {
      iframeMessageBus = new IFrameMessageBus();
      window.parent.addEventListener('message', (e) => {
        if (e.data.message.id === message.id) {
          success = true;
        }
      });
    });

    when('The message bus sends a message', () => {
      iframeMessageBus.send(message);
    });

    then('The message should be usable through the event Message', () => {
      return new Promise<void>((resolve) => {
        // Set Timeout is necessary because we have to
        // wait for the listener to trigger
        setTimeout(() => {
          expect(success).toBeTruthy();
          resolve();
        }, 100);
      });
    });
  });

  test('Message bus receives a message', ({ given, when, and, then }) => {
    let iframeMessageBus: IFrameMessageBus;
    const log = vi.fn((message) => message);
    const listeners: Array<CallableFunction> = [];

    given('I have a message bus instance', () => {
      iframeMessageBus = new IFrameMessageBus();
      window.parent.addEventListener('message', (event) => {
        listeners.forEach((listener) => {
          listener(event.data.message);
        });
      });
    });

    when('My message bus receives a callback', () => {
      listeners.push(log);
    });

    and('A post message is called', () => {
      iframeMessageBus.send('test');
    });

    then('The callback should trigger with post message data', () => {
      return new Promise<void>((resolve) => {
        // Set Timeout is necessary because we have to
        // wait for the listener to trigger
        setTimeout(() => {
          expect(log).toHaveBeenCalledWith('test');
          resolve();
        }, 100);
      });
    });
  });
});
