import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DEFAULT_SSO_AUTH_URL,
  getAuthUrl,
  redirectToLoginPage,
  redirectToLogoutPage,
} from '../../src';

describe('sso module', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      location: {
        host: 'manager.eu.ovhcloud.com',
        href: 'https://manager.eu.ovhcloud.com/#/hub/',
        hash: '#/hub/',
        assign: vi.fn(),
      },
    });
    vi.stubGlobal('document', {
      referrer: '',
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  describe('getAuthUrl', () => {
    it('With localhost', () => {
      vi.stubGlobal('window', {
        location: {
          host: 'localhost:9000',
          hostname: 'localhost',
          href: 'http://localhost:9000/#/web/configuration',
          hash: '#/web/configuration',
          assign: vi.fn(),
        },
      });
      const res = getAuthUrl();
      expect(res).toEqual('/auth/');
    });

    it('With Telecom', () => {
      vi.stubGlobal('window', {
        location: {
          host: 'www.ovhtelecom.fr',
          hostname: 'www.ovhtelecom.fr',
          href: 'https://www.ovhtelecom.fr/manager/#/telecom/',
          hash: '#/telecom/',
          assign: vi.fn(),
        },
      });
      const res = getAuthUrl();
      expect(res).toEqual(DEFAULT_SSO_AUTH_URL.EU);
    });

    it('With EU Region', () => {
      vi.stubGlobal('window', {
        location: {
          host: 'manager.eu.ovhcloud.com',
          hostname: 'manager.eu.ovhcloud.com',
          href: 'https://manager.eu.ovhcloud.com/#/hub/',
          hash: '#/hub/',
          assign: vi.fn(),
        },
      });
      const res = getAuthUrl();
      expect(res).toEqual(DEFAULT_SSO_AUTH_URL.EU);
    });

    it('With CA Region', () => {
      vi.stubGlobal('window', {
        location: {
          host: 'manager.ca.ovhcloud.com',
          hostname: 'manager.ca.ovhcloud.com',
          href: 'https://manager.ca.ovhcloud.com/#/hub/',
          hash: '#/hub/',
          assign: vi.fn(),
        },
      });
      const res = getAuthUrl();
      expect(res).toEqual(DEFAULT_SSO_AUTH_URL.CA);
    });

    it('With US Region', () => {
      vi.stubGlobal('window', {
        location: {
          host: 'manager.us.ovhcloud.com',
          hostname: 'manager.us.ovhcloud.com',
          href: 'https://manager.us.ovhcloud.com/#/hub/',
          hash: '#/hub/',
          assign: vi.fn(),
        },
      });
      const res = getAuthUrl();
      expect(res).toEqual(DEFAULT_SSO_AUTH_URL.US);
    });

    it('With Staging Environment', () => {
      vi.stubGlobal('window', {
        location: {
          host: 'test-branch-name-manager.eu.dtci.ovhcloud.tools',
          hostname: 'test-branch-name-manager.eu.dtci.ovhcloud.tools',
          href: 'https://feat-ovhcom-ovhcloud-migration-manager.eu.dtci.ovhcloud.tools/container/#/hub',
          hash: '#/hub/',
          assign: vi.fn(),
        },
      });
      const res = getAuthUrl();
      expect(res).toEqual(DEFAULT_SSO_AUTH_URL.EU);
    });

    it('fallbacks to EU region', () => {
      vi.stubGlobal('window', {
        location: {
          host: 'manager',
          hostname: 'manager',
          href: 'https://manager/#/hub/',
          hash: '#/hub/',
          assign: vi.fn(),
        },
      });
      const res = getAuthUrl();
      expect(res).toEqual(DEFAULT_SSO_AUTH_URL.EU);
    });
  });

  describe('redirectToLoginPage', () => {
    it('With onsuccess url', () => {
      const windowLocationSpy = vi.spyOn(window.location, 'assign');
      redirectToLoginPage('/onsuccess/url');
      expect(windowLocationSpy).toHaveBeenCalledWith(
        'https://www.ovh.com/auth/?onsuccess=%2Fonsuccess%2Furl',
      );
    });

    it('Without onsuccess url', () => {
      const windowLocationSpy = vi.spyOn(window.location, 'assign');
      redirectToLoginPage();
      expect(windowLocationSpy).toHaveBeenCalledWith(
        'https://www.ovh.com/auth/?onsuccess=https%3A%2F%2Fmanager.eu.ovhcloud.com%2F%23%2Fhub%2F',
      );
    });

    it('For telecom application', () => {
      vi.stubGlobal('window', {
        location: {
          host: 'www.ovhtelecom.fr',
          href: 'https://www.ovhtelecom.fr/manager/#/telecom/',
          hash: '#/telecom/',
          assign: vi.fn(),
        },
      });
      const windowLocationSpy = vi.spyOn(window.location, 'assign');
      redirectToLoginPage();
      expect(windowLocationSpy).toHaveBeenCalledWith(
        'https://www.ovh.com/auth/?onsuccess=https%3A%2F%2Fwww.ovhtelecom.fr%2Fmanager%2F%23%2Ftelecom%2F',
      );
    });

    it('logins in development mode', () => {
      vi.stubGlobal('window', {
        location: {
          host: 'localhost:9000',
          hostname: 'localhost',
          href: 'http://localhost:9000/#/web/configuration',
          hash: '#/web/configuration',
          assign: vi.fn(),
        },
      });
      const windowLocationSpy = vi.spyOn(window.location, 'assign');
      redirectToLoginPage();
      expect(windowLocationSpy).toHaveBeenCalledWith(
        '/auth/?onsuccess=http%3A%2F%2Flocalhost%3A9000%2F%23%2Fweb%2Fconfiguration',
      );
    });
  });

  describe('redirectToLogoutPage', () => {
    it('With onsuccess url', () => {
      const windowLocationSpy = vi.spyOn(window.location, 'assign');
      redirectToLogoutPage('/onsuccess/url');
      expect(windowLocationSpy).toHaveBeenCalledWith(
        'https://www.ovh.com/auth/?action=disconnect&onsuccess=%2Fonsuccess%2Furl',
      );
    });

    it('Without onsuccess url', () => {
      const windowLocationSpy = vi.spyOn(window.location, 'assign');
      redirectToLogoutPage();
      expect(windowLocationSpy).toHaveBeenCalledWith(
        'https://www.ovh.com/auth/?action=disconnect&onsuccess=https%3A%2F%2Fmanager.eu.ovhcloud.com%2F%23%2Fhub%2F',
      );
    });

    it('Adds from parameter when called from secondary µ-app', () => {
      vi.stubGlobal('document', {
        referrer: 'https://manager.eu.ovhcloud.com/',
      });
      const windowLocationSpy = vi.spyOn(window.location, 'assign');
      redirectToLogoutPage();
      expect(windowLocationSpy).toHaveBeenCalledWith(
        'https://www.ovh.com/auth/?action=disconnect&onsuccess=https%3A%2F%2Fmanager.eu.ovhcloud.com%2F%23%2Fhub%2F&from=https%3A%2F%2Fmanager.eu.ovhcloud.com%2F',
      );
    });

    it('For telecom application', () => {
      vi.stubGlobal('window', {
        location: {
          host: 'www.ovhtelecom.fr',
          href: 'https://www.ovhtelecom.fr/manager/#/telecom/',
          hash: '#/telecom/',
          assign: vi.fn(),
        },
      });
      const windowLocationSpy = vi.spyOn(window.location, 'assign');
      redirectToLogoutPage();
      expect(windowLocationSpy).toHaveBeenCalledWith(
        'https://www.ovh.com/auth/?action=disconnect&onsuccess=https%3A%2F%2Fwww.ovhtelecom.fr%2Fmanager%2F%23%2Ftelecom%2F',
      );
    });

    it('logouts in development mode', () => {
      vi.stubGlobal('window', {
        location: {
          host: 'localhost:9000',
          hostname: 'localhost',
          href: 'http://localhost:9000/#/web/configuration',
          hash: '#/web/configuration',
          assign: vi.fn(),
        },
      });
      const windowLocationSpy = vi.spyOn(window.location, 'assign');
      redirectToLogoutPage();
      expect(windowLocationSpy).toHaveBeenCalledWith(
        '/auth/?action=disconnect&onsuccess=http%3A%2F%2Flocalhost%3A9000%2F%23%2Fweb%2Fconfiguration',
      );
    });
  });
});
