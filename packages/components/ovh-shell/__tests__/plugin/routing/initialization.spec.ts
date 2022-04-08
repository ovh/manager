import { loadFeature, defineFeature } from 'jest-cucumber';

import { initRoutingConfiguration } from '../../../src/plugin/routing';
import RoutingConfiguration from '../../../src/plugin/routing/configuration';
import Shell from '../../../src/shell/shell';

const feature = loadFeature(
  '../../../features/plugin/routing/initialization.feature',
  {
    loadRelativePath: true,
  },
);

const windowLocation = window.location;
const setHrefSpy = jest.fn((href) => href);

jest.mock('@ovh-ux/manager-config', () => ({
  fetchConfiguration: () => Promise.resolve({}),
}));

defineFeature(feature, (test) => {
  beforeEach(() => {
    delete window.location;
    window.location = {
      ...window.location,
    };
    Object.defineProperty(window.location, 'href', {
      set: setHrefSpy,
    });
  });

  afterEach(() => {
    window.location = windowLocation;
  });

  test('Initialization of routing plugin in production', ({
    given,
    and,
    when,
    then,
  }) => {
    const shell = new Shell();
    const routingConfig = new RoutingConfiguration();

    given('A production environment', () => {
      window.location.hostname = 'www.ovh.com';
    });

    and('A default application with container disabled', () => {
      shell.registerPlugin('environment', {
        getEnvironment: () => ({
          getApplications: () => ({
            foo: {
              container: {
                enabled: false,
                isDefault: true,
              },
              publicURL: 'http://www.ovh.com/foo',
            },
            bar: {
              container: {
                enabled: true,
                isDefault: false,
              },
              publicURL: 'http://www.ovh.com/bar',
            },
          }),
        }),
      });
    });

    when('The routing plugin is initialized', () => {
      initRoutingConfiguration(shell, routingConfig);
    });

    then(
      "I should be redirected to the default application's publicURL",
      () => {
        expect(setHrefSpy).toHaveBeenCalledWith('http://www.ovh.com/foo');
      },
    );
  });

  test('Initialization of routing plugin in development', ({
    given,
    and,
    when,
    then,
  }) => {
    const shell = new Shell();
    const routingConfig = new RoutingConfiguration();

    given('A development environment', () => {
      window.location.hostname = 'localhost';
    });

    and('A default application with container disabled', () => {
      shell.registerPlugin('environment', {
        getEnvironment: () => ({
          getApplications: () => ({
            foo: {
              container: {
                enabled: false,
                isDefault: true,
              },
              publicURL: 'http://www.ovh.com/foo',
            },
            bar: {
              container: {
                enabled: true,
                isDefault: false,
              },
              publicURL: 'http://www.ovh.com/bar',
            },
          }),
        }),
      });
    });

    when('The routing plugin is initialized', () => {
      initRoutingConfiguration(shell, routingConfig);
    });

    then('I should not be redirected', () => {
      expect(setHrefSpy).not.toHaveBeenCalled();
    });
  });
});
