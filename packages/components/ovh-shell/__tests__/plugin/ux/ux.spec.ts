import { loadFeature, defineFeature, DefineStepFunction } from 'jest-cucumber';

import ux from '../../../src/plugin/ux';
import DirectClientMessageBus from '../../../src/message-bus/direct-client';
import Shell from '../../../src/shell/shell';

const feature = loadFeature('../../../features/plugin/ux/ux.feature', {
  loadRelativePath: true,
});

defineFeature(feature, (test) => {
  let uxPlugin: CallableFunction;

  const shellMessageBus = new DirectClientMessageBus();
  const shell = new Shell(shellMessageBus);

  // define ux instanciation
  const givenUxPluginInstanciated = (given: DefineStepFunction) => {
    given('I have a ux plugin instanciated with a registered sidebar', () => {
      uxPlugin = ux(shell);
      uxPlugin.registerSidebar('foo');
    });
  };

  test('Toggle the visibility of a ux component', ({ given, when, then }) => {
    let locale: string;

    givenUxPluginInstanciated(given);

    when('I toggle the visibility of the sidebar', () => {
      uxPlugin.toggleSidebarVisibility('foo');
    });

    then('I should see the sidebar', () => {
      expect(uxPlugin.isSidebarVisible('foo')).toBe(true);
    });
  });
});
