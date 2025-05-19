import DirectClientMessageBus from '../../src/message-bus/direct-client';
import { vi } from 'vitest';
import { IShellMessage } from '../common';

describe('Test direct client', () => {
  it('Application sends a message to the shell', () => {
    let appClientMessageBus;
    let shellClientMessageBus;
    const sampleAppMessage = {} as IShellMessage<unknown>;
    const appReceiveHandler = vi.fn();
    const shellReceiveHandler = vi.fn();

    appClientMessageBus = new DirectClientMessageBus();
    shellClientMessageBus = new DirectClientMessageBus();

    appClientMessageBus.addPeer(shellClientMessageBus);
    shellClientMessageBus.addPeer(appClientMessageBus);

    appClientMessageBus.onReceive(appReceiveHandler);
    shellClientMessageBus.onReceive(shellReceiveHandler);

    appClientMessageBus.send(sampleAppMessage);

    expect(shellReceiveHandler).toHaveBeenCalledWith(sampleAppMessage);
    expect(appReceiveHandler).not.toHaveBeenCalled();
  });

  it('Shell sends a message to the application', () => {
    let appClientMessageBus;
    let shellClientMessageBus;
    const sampleShellMessage = {} as IShellMessage<unknown>;
    const appReceiveHandler = vi.fn();
    const shellReceiveHandler = vi.fn();

    appClientMessageBus = new DirectClientMessageBus();
    shellClientMessageBus = new DirectClientMessageBus();

    appClientMessageBus.addPeer(shellClientMessageBus);
    shellClientMessageBus.addPeer(appClientMessageBus);

    appClientMessageBus.onReceive(appReceiveHandler);
    shellClientMessageBus.onReceive(shellReceiveHandler);

    shellClientMessageBus.send(sampleShellMessage);

    expect(appReceiveHandler).toHaveBeenCalledWith(sampleShellMessage);
    expect(shellReceiveHandler).not.toHaveBeenCalled();
  });

  it(`A direct message bus should only communicate with it's registered peers`, () => {
    let appClientMessageBus;
    let shellClientMessageBus;
    let otherClientMessageBus;
    const appReceiveHandler = vi.fn();
    const shellReceiveHandler = vi.fn();
    const otherReceiveHandler = vi.fn();
    const sampleMessage = {} as IShellMessage<unknown>;

    appClientMessageBus = new DirectClientMessageBus();
    shellClientMessageBus = new DirectClientMessageBus();
    otherClientMessageBus = new DirectClientMessageBus();

    appClientMessageBus.onReceive(appReceiveHandler);
    shellClientMessageBus.onReceive(shellReceiveHandler);
    otherClientMessageBus.onReceive(otherReceiveHandler);

    appClientMessageBus.addPeer(shellClientMessageBus);
    shellClientMessageBus.addPeer(appClientMessageBus);
    appClientMessageBus.send(sampleMessage);

    expect(shellReceiveHandler).toHaveBeenCalledWith(sampleMessage);
    expect(appReceiveHandler).not.toHaveBeenCalled();
    expect(otherReceiveHandler).not.toHaveBeenCalled();
  });
});
