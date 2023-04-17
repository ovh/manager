import { loadFeature, defineFeature } from 'jest-cucumber';
import { Application } from '@ovh-ux/manager-config';
import { buildURLIfStandalone } from '../../src/client';

const feature = loadFeature('../../features/client/client-init.feature', {
  loadRelativePath: true,
});

defineFeature(feature, (test) => {
  afterEach(() => {
    delete window.location;
  });

  test('Open app without container when standalone', ({
    given,
    and,
    when,
    then,
  }) => {
    const appConfig = {
      publicURL: 'https://www.publicstandalone.com/',
      container: {
        enabled: false,
      },
    } as Application;
    let finalURL = '';

    given('I have a standalone application', () => {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'https://www.ovhcontainer.com/manager/#/foo?mon=1&standalone=1',
          search: '?mon=1&standalone=1',
          origin: 'https://www.ovhcontainer.com',
          host: 'ovhcontainer',
          hostname: 'ovhcontainer',
          hash: '#',
        },
      });
    });

    and('Container is enabled', () => {
      appConfig.container.enabled = true;
    });

    when('I detect the parameter standalone in the URL', () => {
      finalURL = buildURLIfStandalone(appConfig);
    });

    then('I do not redirect and returns current url without change', () => {
      expect(finalURL).toBe(window.location.href);
    });
  });

  test('Open app in container when not standalone', ({
    given,
    and,
    when,
    then,
  }) => {
    const appConfig = {
      publicURL: 'https://www.publicstandalone.com/',
      container: {
        enabled: false,
      },
    } as Application;
    let finalURL = '';

    given('I have an app', () => {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'https://www.ovhcontainer.com/manager/#/foo?mon=1',
          search: '?mon=1',
          origin: 'https://www.ovhcontainer.com',
          host: 'ovhcontainer',
          hostname: 'ovhcontainer',
          hash: '#',
        },
      });
    });

    and('Container is enabled', () => {
      appConfig.container.enabled = true;
    });

    when('I do not see the parameter standone in the url', () => {
      finalURL = buildURLIfStandalone(appConfig);
    });

    then('I redirect to public URL', () => {
      expect(finalURL).toBe('https://www.publicstandalone.com/#/');
    });
  });
});
