import { loadFeature, defineFeature, DefineStepFunction } from 'jest-cucumber';

import Application from '../../../src/plugin/routing/application';
import RoutingConfiguration from '../../../src/plugin/routing/configuration';

const feature = loadFeature(
  '../../../features/plugin/routing/application.feature',
  {
    loadRelativePath: true,
  },
);

const windowLocation = window.location;
const setHrefSpy = jest.fn((href) => href);

defineFeature(feature, (test) => {
  let app: Application;
  let myURL = '';

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

  test('Navigating to an app in another container', ({
    given,
    and,
    when,
    then,
  }) => {
    given('I am in the hub app', () => {
      myURL = 'https://localhost/#/hub/';
    });

    and(
      'My app is configured with hub and a foo application in another container',
      () => {
        const config = new RoutingConfiguration();
        const iframe = document.createElement('iframe');
        config.addConfiguration({ id: 'hub', path: '/hub/' });
        config.addConfiguration({
          id: 'foo',
          path: '/foo/',
          publicURL: 'https://foo/foo/',
        });
        app = new Application(iframe, config);
      },
    );

    when('I navigate to the foo application', () => {
      const spy = jest
        .spyOn(app, 'getApplicationPath')
        .mockImplementation(() => '/');
      app.updateRouting({
        applicationId: 'foo',
        applicationHash: '/bar',
      });
      spy.mockRestore();
    });

    then('I should be redirected to foo application publicURL', () => {
      expect(setHrefSpy).toHaveBeenCalledWith('https://foo/foo/#/bar');
    });
  });
});
