import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Application } from '@ovh-ux/manager-config';
import { buildURLIfStandalone } from '.';

describe('client initialisation', () => {
  it('Open app without container when standalone', () => {
    const appConfig = {
      publicURL: 'https://www.publicstandalone.com/',
      container: {
        enabled: false,
      },
    } as Application;
    let finalURL = '';

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
    appConfig.container.enabled = true;
    finalURL = buildURLIfStandalone(appConfig);
    expect(finalURL).toBe(window.location.href);
  });

  it('Open app in container when not standalone', () => {
    const appConfig = {
      publicURL: 'https://www.publicstandalone.com/',
      container: {
        enabled: false,
      },
    } as Application;
    let finalURL = '';

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

    appConfig.container.enabled = true;
    finalURL = buildURLIfStandalone(appConfig);
    expect(finalURL).toBe('https://www.publicstandalone.com/#/');
  });
});
