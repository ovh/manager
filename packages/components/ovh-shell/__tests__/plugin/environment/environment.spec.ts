import { loadFeature, defineFeature, DefineStepFunction } from 'jest-cucumber';
import { Environment } from '@ovh-ux/manager-config';

import environmentPlugin from '../../../src/plugin/environment';
import DirectClientMessageBus from '../../../src/message-bus/direct-client';
import Shell from '../../../src/shell/shell';

const feature = loadFeature(
  '../../../features/plugin/environment/environment.feature',
  {
    loadRelativePath: true,
  },
);

defineFeature(feature, (test) => {
  let envPlugin;
  let onUniverseChangeCallback;

  const shellMessageBus = new DirectClientMessageBus();
  const shell = new Shell();
  shell.setMessageBus(shellMessageBus);

  test('Changing the selected universe', ({ and, given, when, then }) => {
    given('I have an environment instanciated', () => {
      envPlugin = environmentPlugin(
        new Environment({
          applications: {
            dedicated: {
              universe: 'foo',
            },
          },
        }),
      );
    });

    and('A custom action is setted on universe change', () => {
      onUniverseChangeCallback = jest.fn(() => 'action');
      envPlugin.onUniverseChange(onUniverseChangeCallback);
    });

    when('I change the selected universe', () => {
      envPlugin.setUniverse('dedicated');
    });

    then('I should have the universe updated', () => {
      const env = envPlugin.getEnvironment();
      expect(env.getUniverse()).toBe('foo');
    });

    and('The custom action should be triggered', () => {
      expect(onUniverseChangeCallback).toHaveBeenCalledWith('foo');
    });
  });
});
