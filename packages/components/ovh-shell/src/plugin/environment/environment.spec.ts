import { Environment } from '@ovh-ux/manager-config';

import environmentPlugin from '../../../src/plugin/environment';
import DirectClientMessageBus from '../../../src/message-bus/direct-client';
import Shell from '../../../src/shell/shell';
import { vi } from 'vitest';

describe('Test environment', () => {
  let envPlugin;
  let onUniverseChangeCallback;

  const shellMessageBus = new DirectClientMessageBus();
  const shell = new Shell();
  shell.setMessageBus(shellMessageBus);

  it('Changing the selected universe', () => {
    envPlugin = environmentPlugin(
      new Environment(({
        applications: {
          dedicated: {
            universe: 'foo',
          },
        },
      } as unknown) as Environment),
    );

    onUniverseChangeCallback = vi.fn(() => 'action');
    envPlugin.onUniverseChange(onUniverseChangeCallback);

    envPlugin.setApplication('dedicated');

    const env = envPlugin.getEnvironment();
    expect(env.getUniverse()).toBe('foo');

    expect(onUniverseChangeCallback).toHaveBeenCalledWith('foo');
  });
});
