import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { redirectToLoginPage, redirectToLogoutPage } from '../../src';

describe('sso module', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      location: {
        host: 'www.ovh.com',
        href: 'https://www.ovh.com/manager/#/hub/',
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
  });

  describe('redirectToLoginPage', () => {
    it('With onsuccess url', () => {
      const windowLocationSpy = vi.spyOn(window.location, 'assign');
      redirectToLoginPage('/onsuccess/url');
      expect(windowLocationSpy).toHaveBeenCalledWith('/auth/?onsuccess=%2Fonsuccess%2Furl');
    });

    it('Without onsuccess url', () => {
      const windowLocationSpy = vi.spyOn(window.location, 'assign');
      redirectToLoginPage();
      expect(windowLocationSpy).toHaveBeenCalledWith(
        '/auth/?onsuccess=https%3A%2F%2Fwww.ovh.com%2Fmanager%2F%23%2Fhub%2F',
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
  });

  describe('redirectToLogoutPage', () => {
    it('With onsuccess url', () => {
      const windowLocationSpy = vi.spyOn(window.location, 'assign');
      redirectToLogoutPage('/onsuccess/url');
      expect(windowLocationSpy).toHaveBeenCalledWith(
        '/auth/?action=disconnect&onsuccess=%2Fonsuccess%2Furl',
      );
    });

    it('Without onsuccess url', () => {
      const windowLocationSpy = vi.spyOn(window.location, 'assign');
      redirectToLogoutPage();
      expect(windowLocationSpy).toHaveBeenCalledWith(
        '/auth/?action=disconnect&onsuccess=https%3A%2F%2Fwww.ovh.com%2Fmanager%2F%23%2Fhub%2F',
      );
    });

    it('Adds from parameter when called from secondary µ-app', () => {
      vi.stubGlobal('document', {
        referrer: 'https://www.ovh.com/manager/',
      });
      const windowLocationSpy = vi.spyOn(window.location, 'assign');
      redirectToLogoutPage();
      expect(windowLocationSpy).toHaveBeenCalledWith(
        '/auth/?action=disconnect&onsuccess=https%3A%2F%2Fwww.ovh.com%2Fmanager%2F%23%2Fhub%2F&from=https%3A%2F%2Fwww.ovh.com%2Fmanager%2F',
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
  });
});
