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
    const shell = new Shell(shellMessageBus);
    const shellClient = new ShellClient(shellClientMessageBus);
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
});
