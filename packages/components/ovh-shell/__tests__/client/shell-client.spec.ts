import { loadFeature, defineFeature } from 'jest-cucumber';
import DirectClientMessageBus from '../../src/message-bus/direct-client';
import Shell from '../../src/shell/shell';
import ShellClient from '../../src/client/shell-client';
import { IShellPluginMethodCall } from '../../src/common';

const feature = loadFeature('../../features/client/shell-client.feature', {
  loadRelativePath: true,
});

defineFeature(feature, (test) => {
  test('Plugin method invokation', ({ given, when, and, then }) => {
    const shellClientMessageBus = new DirectClientMessageBus();
    const shellMessageBus = new DirectClientMessageBus();
    const shell = new Shell();
    const shellClient = new ShellClient();
    const callback = jest.fn((param: string) => param);
    const pluginName = 'test';

    given('I have one plugin registered in my shell', () => {
      shell.getPluginManager().registerPlugin(pluginName, {
        callback,
      });
    });

    and(
      'My shell and shell client are configured with a direct message bus',
      () => {
        shell.setMessageBus(shellMessageBus);
        shellClient.setMessageBus(shellClientMessageBus);
        shellClientMessageBus.addPeer(shellMessageBus);
        shellMessageBus.addPeer(shellClientMessageBus);
      },
    );

    when('I invoke a method from my plugin', () => {
      const pluginInvokation: IShellPluginMethodCall = {
        plugin: pluginName,
        method: 'callback',
        args: ['param'],
      };
      shellClient.invokePluginMethod(pluginInvokation);
    });

    then('The invokation should be resolved with the method result', () => {
      expect(callback).toHaveBeenCalledWith('param');
    });
  });

  test('Plugin event listener', ({ given, when, and, then }) => {
    const shellClientMessageBus = new DirectClientMessageBus();
    const shellMessageBus = new DirectClientMessageBus();
    const shell = new Shell();
    const shellClient = new ShellClient();
    const callback = jest.fn((param: string) => param);
    const callback2 = jest.fn((param: string) => param);

    given(
      'My shell and shell client are configured with a direct message bus',
      () => {
        shell.setMessageBus(shellMessageBus);
        shellClient.setMessageBus(shellClientMessageBus);
        shellClientMessageBus.addPeer(shellMessageBus);
        shellMessageBus.addPeer(shellClientMessageBus);
      },
    );

    and('I add an event listener on the shell client', () => {
      shellClient.addEventListener('foo', callback);
      shellClient.addEventListener('bar', callback2);
    });

    when('The shell emits an event', () => {
      shell.emitEvent('foo', 'param');
    });

    then(
      'The event emitted from the shell should be received by the client',
      () => {
        expect(callback).toHaveBeenCalledWith('param');
        expect(callback2).not.toHaveBeenCalled();
      },
    );
  });
});
