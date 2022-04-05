import { loadFeature, defineFeature } from 'jest-cucumber';
import {
  ILocation,
  Orchestrator,
} from '../../../src/plugin/routing/orchestrator';
import RoutingConfiguration from '../../../src/plugin/routing/configuration';

const feature = loadFeature(
  '../../../features/plugin/routing/orchestrator.feature',
  {
    loadRelativePath: true,
  },
);

function LocationMock(initialHref = ''): ILocation {
  let href = initialHref;
  return {
    setURL: (target) => {
      href = target;
    },
    getURL: () => new URL(href),
  };
}

defineFeature(feature, (test) => {
  let orchestrator: Orchestrator;
  let config: RoutingConfiguration;
  const iframe = LocationMock();
  const container = LocationMock();

  test('Navigating in iframe updates the container URL', ({
    given,
    and,
    when,
    then,
  }) => {
    given('A routing configuration', () => {
      config = new RoutingConfiguration();
      config.addConfiguration({ id: 'home', path: '/hub/' });
      config.addConfiguration({ id: 'dedicated', path: '/foo/' });
    });

    and('An orchestrator', () => {
      orchestrator = new Orchestrator(config, iframe, container);
    });

    when('I navigate in the iframe', () => {
      iframe.setURL('https://www.ovh.com/hub/#/foo?x=y');
      container.setURL('https://www.ovh.com/manager/');
      orchestrator.updateContainerURL();
    });

    then('The container URL should be updated', () => {
      expect(container.getURL().href).toBe(
        'https://www.ovh.com/manager/#/home/foo?x=y',
      );
    });
  });

  test('Changing the container URL update the iframe URL', ({
    given,
    and,
    when,
    then,
  }) => {
    given('A routing configuration', () => {
      config = new RoutingConfiguration();
      config.addConfiguration({ id: 'home', path: '/hub/' });
      config.addConfiguration({ id: 'dedicated', path: '/foo/' });
    });

    and('An orchestrator', () => {
      orchestrator = new Orchestrator(config, iframe, container);
    });

    when('I change the container URL', () => {
      container.setURL('https://www.ovh.com/manager/#/dedicated/hello?foo=bar');
      iframe.setURL('https://www.ovh.com/hub/#/foo?x=y');
      orchestrator.updateIframeURL();
    });

    then('The iframe URL should be updated', () => {
      expect(iframe.getURL().href).toBe(
        'https://www.ovh.com/foo/#/hello?foo=bar',
      );
    });
  });

  test('Changing the container URL to a standalone application', ({
    given,
    and,
    when,
    then,
  }) => {
    given('A routing configuration', () => {
      config = new RoutingConfiguration();
      config.addConfiguration({ id: 'home', path: '/hub/' });
      config.addRedirection(
        'dedicated',
        'https://www.ovh.com/manager/dedicated/',
      );
    });

    and('An orchestrator', () => {
      orchestrator = new Orchestrator(config, iframe, container);
    });

    when('I change the container URL to a standalone application', () => {
      container.setURL('https://www.ovh.com/manager/#/dedicated/hello?foo=bar');
      iframe.setURL('https://www.ovh.com/hub/#/');
      orchestrator.updateIframeURL();
    });

    then('I should be redirected', () => {
      expect(container.getURL().href).toBe(
        'https://www.ovh.com/manager/dedicated/#/hello?foo=bar',
      );
    });
  });

  test('Changing the container URL to an unknown application', ({
    given,
    and,
    when,
    then,
  }) => {
    given('A routing configuration', () => {
      config = new RoutingConfiguration();
      config.addConfiguration({ id: 'home', path: '/hub/' });
      config.addConfiguration({ id: 'test', path: '/test/' });
    });

    and('An orchestrator', () => {
      orchestrator = new Orchestrator(config, iframe, container);
    });

    when('I change the container URL to an unknown application', () => {
      container.setURL('https://www.ovh.com/manager/#/hello/ok');
      iframe.setURL('https://www.ovh.com/test/#/');
      orchestrator.updateIframeURL();
    });

    then('I should be redirected to the default application', () => {
      expect(container.getURL().href).toBe(
        'https://www.ovh.com/manager/#/home/',
      );
    });
  });
});
