import { loadFeature, defineFeature } from 'jest-cucumber';
import DirectClientMessageBus from '../../src/message-bus/direct-client';
import Shell from '../../src/shell/shell';
import ShellClient from '../../src/client/shell-client';
import {
  buildURLIfStandalone,
  initStandaloneClientApi,
} from '../../src/client';
import { IShellPluginMethodCall } from '../../src/common';

const feature = loadFeature('../../features/client/shell-client.feature', {
  loadRelativePath: true,
});
const windowLocation = window.location;

defineFeature(feature, (test) => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {});
    window.location = {
      ...window.location,
      hash: '',
      href: '',
    };
  });

  afterEach(() => {
    window.location = windowLocation;
  });

  test('Plugin method invokation', ({ given, when, and, then }) => {
    const shellClientMessageBus = new DirectClientMessageBus();
    const shellMessageBus = new DirectClientMessageBus();
    const shell = new Shell();
    const shellClient = new ShellClient();
    const callback = vi.fn((param: string) => param);
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
    const callback = vi.fn((param: string) => param);
    const callback2 = vi.fn((param: string) => param);

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

  test('Redirection of contained applications', ({ given, when, then }) => {
    let appConfig: any = {};
    let url = '';

    given('An application configuration where the container is enabled', () => {
      appConfig = {
        hub: {
          universe: 'fooUniverse',
          url: 'http://hub',
          container: {
            enabled: true,
            isDefault: false,
            path: 'hub',
            containerURL: 'http://container/',
          },
          publicURL: 'http://container/#/hub',
        },
      };
      window.location.hostname = 'container';
    });

    when('The application is initialized as a standalone application', () => {
      url = buildURLIfStandalone(appConfig.hub);
    });

    then(
      "The client should be redirected to the application's publicURL",
      () => {
        expect(url).toBe('http://container/#/hub');
      },
    );

    when(
      'The application is initialized as a standalone application and an hash',
      () => {
        window.location.hash = '#/foo';
        url = buildURLIfStandalone(appConfig.hub);
      },
    );

    then(
      "The client should be redirected to the application's publicURL concatened with the hash",
      () => {
        expect(url).toBe('http://container/#/hub/foo');
      },
    );
  });
});
