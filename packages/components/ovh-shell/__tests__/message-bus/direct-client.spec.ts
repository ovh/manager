import { loadFeature, defineFeature } from 'jest-cucumber';
import DirectClientMessageBus from '../../src/message-bus/direct-client';

const feature = loadFeature(
  '../../features/message-bus/direct-client.feature',
  {
    loadRelativePath: true,
  },
);

defineFeature(feature, (test) => {
  test('Application sends a message to the shell', ({ given, when, then }) => {
    let appClientMessageBus;
    let shellClientMessageBus;
    const sampleAppMessage = {};
    const appReceiveHandler = vi.fn();
    const shellReceiveHandler = vi.fn();

    given(
      'A direct message bus configured between the application and the shell',
      () => {
        appClientMessageBus = new DirectClientMessageBus();
        shellClientMessageBus = new DirectClientMessageBus();

        appClientMessageBus.addPeer(shellClientMessageBus);
        shellClientMessageBus.addPeer(appClientMessageBus);

        appClientMessageBus.onReceive(appReceiveHandler);
        shellClientMessageBus.onReceive(shellReceiveHandler);
      },
    );

    when(`The application's message bus sends a message`, () => {
      appClientMessageBus.send(sampleAppMessage);
    });

    then('The message should be received by the shell', () => {
      expect(shellReceiveHandler).toHaveBeenCalledWith(sampleAppMessage);
      expect(appReceiveHandler).not.toHaveBeenCalled();
    });
  });

  test('Shell sends a message to the application', ({ given, when, then }) => {
    let appClientMessageBus;
    let shellClientMessageBus;
    const sampleShellMessage = {};
    const appReceiveHandler = vi.fn();
    const shellReceiveHandler = vi.fn();

    given(
      'A direct message bus configured between the application and the shell',
      () => {
        appClientMessageBus = new DirectClientMessageBus();
        shellClientMessageBus = new DirectClientMessageBus();

        appClientMessageBus.addPeer(shellClientMessageBus);
        shellClientMessageBus.addPeer(appClientMessageBus);

        appClientMessageBus.onReceive(appReceiveHandler);
        shellClientMessageBus.onReceive(shellReceiveHandler);
      },
    );

    when(`The shell's message bus sends a message`, () => {
      shellClientMessageBus.send(sampleShellMessage);
    });

    then('The message should be received by the application', () => {
      expect(appReceiveHandler).toHaveBeenCalledWith(sampleShellMessage);
      expect(shellReceiveHandler).not.toHaveBeenCalled();
    });
  });

  test(`A direct message bus should only communicate with it's registered peers`, ({
    given,
    when,
    then,
  }) => {
    let appClientMessageBus;
    let shellClientMessageBus;
    let otherClientMessageBus;
    const appReceiveHandler = vi.fn();
    const shellReceiveHandler = vi.fn();
    const otherReceiveHandler = vi.fn();
    const sampleMessage = {};

    given('Multiple direct message bus', () => {
      appClientMessageBus = new DirectClientMessageBus();
      shellClientMessageBus = new DirectClientMessageBus();
      otherClientMessageBus = new DirectClientMessageBus();

      appClientMessageBus.onReceive(appReceiveHandler);
      shellClientMessageBus.onReceive(shellReceiveHandler);
      otherClientMessageBus.onReceive(otherReceiveHandler);

      appClientMessageBus.addPeer(shellClientMessageBus);
      shellClientMessageBus.addPeer(appClientMessageBus);
    });
    when('One message is sent from a message bus', () => {
      appClientMessageBus.send(sampleMessage);
    });
    then(
      'Only the message bus registered peers should receive the message',
      () => {
        expect(shellReceiveHandler).toHaveBeenCalledWith(sampleMessage);
        expect(appReceiveHandler).not.toHaveBeenCalled();
        expect(otherReceiveHandler).not.toHaveBeenCalled();
      },
    );
  });
});
