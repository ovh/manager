import { loadFeature, defineFeature } from 'jest-cucumber';
import { Environment } from '@ovh-ux/manager-config';

import navigationPlugin from '../../../src/plugin/navigation';
import DirectClientMessageBus from '../../../src/message-bus/direct-client';
import Shell from '../../../src/shell/shell';

const feature = loadFeature(
  '../../../features/plugin/navigation/navigation.feature',
  {
    loadRelativePath: true,
  },
);

defineFeature(feature, (test) => {
  let navPlugin;

  const shellMessageBus = new DirectClientMessageBus();
  const shell = new Shell();
  shell.setMessageBus(shellMessageBus);

  test('Retrieving a URL', ({ given, when, then }) => {
    let desiredURL;

    given('I have a navigation plugin instanciated', () => {
      navPlugin = navigationPlugin(
        new Environment({
          applications: {
            dedicated: {
              publicURL: '/manager/#/foo',
            },
          },
        }),
      );
    });

    when('I try to get a URL from an application', () => {
      desiredURL = navPlugin.getURL('dedicated', '#/this/is/:what', {
        what: 'awesome',
      });
    });

    then('I should get a builded URL', () => {
      expect(desiredURL).toBe('/manager/#/foo/this/is/awesome');
    });
  });
});
