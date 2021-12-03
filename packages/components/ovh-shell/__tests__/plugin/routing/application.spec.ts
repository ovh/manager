import { loadFeature, defineFeature, DefineStepFunction } from 'jest-cucumber';

import Application from '../../../src/plugin/routing/application';
import RoutingConfiguration from '../../../src/plugin/routing/configuration';

const feature = loadFeature(
  '../../../features/plugin/routing/application.feature',
  {
    loadRelativePath: true,
  },
);

defineFeature(feature, (test) => {
  let app: Application;
  let myURL = '';

  const givenIAmInHubApp = (given: DefineStepFunction) => {
    given('I am in the hub app', () => {
      myURL = 'https://localhost/#/hub/';
    });
  };

  const andMyAppIsConfiguredWithHubAndDedicated = (and: DefineStepFunction) => {
    and('My app is configured with hub and dedicated apps', () => {
      const config = new RoutingConfiguration();
      const iframe = document.createElement('iframe');
      config.addConfiguration({ id: 'hub', path: '/hub/' });
      config.addConfiguration({ id: 'dedicated', path: '/foo/' });
      app = new Application(iframe, config);
    });
  };

  test('Navigating to an another app', ({ given, and, when, then }) => {
    givenIAmInHubApp(given);

    andMyAppIsConfiguredWithHubAndDedicated(and);

    when('I navigate to dedicated app', () => {
      const currentURL = new URL(myURL);
      const updatedURL = app.updateURL(
        currentURL,
        'dedicated',
        'foohash',
        currentURL.pathname,
      );
      myURL = updatedURL.href;
    });

    then('My URl should have updated with dedicated path config', () => {
      expect(myURL).toEqual('https://localhost/foo/#/foohash');
    });
  });

  test('Navigating to an inexistant app', ({ given, and, when, then }) => {
    let errorFunction: CallableFunction;

    givenIAmInHubApp(given);

    andMyAppIsConfiguredWithHubAndDedicated(and);

    when('I navigate to app web', () => {
      const currentURL = new URL(myURL);
      errorFunction = () =>
        app.updateURL(currentURL, 'web', 'foohash', currentURL.pathname);
    });

    then('I should have an error thrown', () => {
      expect(errorFunction).toThrow(
        new Error("Cannot find configuration for application with id 'web'"),
      );
    });
  });

  test('Navigating to another app from constructed URL', ({
    given,
    when,
    and,
    then,
  }) => {
    givenIAmInHubApp(given);

    andMyAppIsConfiguredWithHubAndDedicated(and);

    and('My URL has a lot of parameters', () => {
      myURL = 'https://localhost/hub/email&id=32&email=toto';
    });

    when('I navigate to app dedicated', () => {
      const currentURL = new URL(myURL);
      const updatedURL = app.updateURL(
        currentURL,
        'dedicated',
        'foohash',
        currentURL.pathname,
      );
      myURL = updatedURL.href;
    });

    then(
      'My URL should be clean and updated with dedicated path config',
      () => {
        expect(myURL).toEqual('https://localhost/foo/#/foohash');
      },
    );
  });
});
