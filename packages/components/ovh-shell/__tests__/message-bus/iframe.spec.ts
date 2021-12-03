import { loadFeature, defineFeature } from 'jest-cucumber';
import IFrameMessageBus from '../../src/message-bus/iframe';

const feature = loadFeature('../../features/message-bus/iframe.feature', {
  loadRelativePath: true,
});

defineFeature(feature, (test) => {
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
    const log = jest.fn((entry) => entry);

    given('I have a message bus instance', () => {
      iframeMessageBus = new IFrameMessageBus();
    });

    when('My message bus receives a callback', () => {
      iframeMessageBus.onReceive(log);
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
