import DirectClientMessageBus from '../../src/message-bus/direct-client';
import Shell from '../../src/shell/shell';
import ShellClient from '../../src/client/shell-client';
import { initStandaloneClientApi } from '../../src/client';
import { IShellPluginMethodCall } from '../../src/common';
import { vi } from 'vitest';

const windowLocation = window.location;
const setHrefSpy = vi.fn((href) => href);

describe('Test shell client', () => {
  beforeEach(() => {
    delete window.location;
    window.location = {
      ...window.location,
      hash: '',
    } as string & Location;
    Object.defineProperty(window.location, 'href', {
      set: setHrefSpy,
    });
  });

  afterEach(() => {
    window.location = windowLocation as string & Location;
  });

  it('Plugin method invokation', () => {
    const shellClientMessageBus = new DirectClientMessageBus();
    const shellMessageBus = new DirectClientMessageBus();
    const shell = new Shell();
    const shellClient = new ShellClient();
    const callback = vi.fn((param: string) => param);
    const pluginName = 'test';

    shell.getPluginManager().registerPlugin(pluginName, {
      callback,
    });

    shell.setMessageBus(shellMessageBus);
    shellClient.setMessageBus(shellClientMessageBus);
    shellClientMessageBus.addPeer(shellMessageBus);
    shellMessageBus.addPeer(shellClientMessageBus);

    const pluginInvokation: IShellPluginMethodCall = {
      plugin: pluginName,
      method: 'callback',
      args: ['param'],
    };
    shellClient.invokePluginMethod(pluginInvokation);

    expect(callback).toHaveBeenCalledWith('param');
  });

  it('Plugin event listener', () => {
    const shellClientMessageBus = new DirectClientMessageBus();
    const shellMessageBus = new DirectClientMessageBus();
    const shell = new Shell();
    const shellClient = new ShellClient();
    const callback = vi.fn((param: string) => param);
    const callback2 = vi.fn((param: string) => param);

    shell.setMessageBus(shellMessageBus);
    shellClient.setMessageBus(shellClientMessageBus);
    shellClientMessageBus.addPeer(shellMessageBus);
    shellMessageBus.addPeer(shellClientMessageBus);

    shellClient.addEventListener('foo', callback);
    shellClient.addEventListener('bar', callback2);

    shell.emitEvent('foo', 'param');

    expect(callback).toHaveBeenCalledWith('param');
    expect(callback2).not.toHaveBeenCalled();
  });

  it('Redirection of contained applications', () => {
    const appConfig = {
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

    initStandaloneClientApi('hub', appConfig);
    expect(setHrefSpy).toHaveBeenCalledWith('http://container/#/hub');

    window.location.hash = '#/foo';
    initStandaloneClientApi('hub', appConfig);

    expect(setHrefSpy).toHaveBeenCalledWith('http://container/#/hub/foo');
  });
});
