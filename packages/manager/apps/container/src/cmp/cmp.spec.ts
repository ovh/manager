import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createCmp } from './cmp';
import {
  CMP_LOADER_URLS,
  CMP_READY_EVENT,
  CMP_READY_TIMEOUT_MS,
} from './cmp.constants';

type CmpTestWindow = Window & {
  __cmp?: (command: string, ...args: unknown[]) => unknown;
  __cmpConfig?: Record<string, unknown>;
};

const testWindow = (window as unknown) as CmpTestWindow;

const injectScript = vi.fn();

const makeCmp = () => createCmp({ injectScript });

const setHostname = (hostname: string) => {
  Object.defineProperty(window, 'location', {
    value: { ...window.location, hostname },
    writable: true,
    configurable: true,
  });
};

/** Simulates the CMP bundle coming up: registers __cmp then fires cmp:ready. */
const simulateCmpReady = (api = vi.fn()) => {
  testWindow.__cmp = api;
  window.dispatchEvent(new CustomEvent(CMP_READY_EVENT));
  return api;
};

describe('cmp facade', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    setHostname('manager.eu.ovhcloud.com');
    delete testWindow.__cmp;
    delete testWindow.__cmpConfig;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('load', () => {
    it('declares __cmpConfig before injecting the production loader', () => {
      let configAtInjection: Record<string, unknown> | undefined;
      injectScript.mockImplementation(() => {
        configAtInjection = testWindow.__cmpConfig
          ? { ...testWindow.__cmpConfig }
          : undefined;
      });

      makeCmp().load({ locale: 'fr_FR', region: 'EU' });

      expect(injectScript).toHaveBeenCalledTimes(1);
      expect(injectScript.mock.calls[0]?.[0]).toBe(CMP_LOADER_URLS.production);
      expect(configAtInjection).toEqual({
        locale: 'fr-FR',
        region: 'EU',
        environment: 'production',
        scripts: [],
      });
    });

    it.each(['localhost', 'manager.lab.ovh.dev'])(
      'declares preproduction and uses the preprod loader on %s',
      (hostname) => {
        setHostname(hostname);

        makeCmp().load({ locale: 'en_GB', region: 'CA' });

        expect(injectScript.mock.calls[0]?.[0]).toBe(
          CMP_LOADER_URLS.preproduction,
        );
        expect(testWindow.__cmpConfig).toMatchObject({
          locale: 'en-GB',
          region: 'CA',
          environment: 'preproduction',
        });
      },
    );

    it('is idempotent', () => {
      const cmp = makeCmp();
      cmp.load({ locale: 'fr_FR', region: 'EU' });
      cmp.load({ locale: 'fr_FR', region: 'EU' });

      expect(injectScript).toHaveBeenCalledTimes(1);
    });
  });

  describe('whenReady', () => {
    it('resolves on cmp:ready without error', async () => {
      const cmp = makeCmp();
      cmp.load({ locale: 'fr_FR', region: 'EU' });

      simulateCmpReady();
      await expect(cmp.whenReady()).resolves.toBeUndefined();
      expect(cmp.isError()).toBe(false);
    });

    it('short-circuits when window.__cmp is already up', async () => {
      testWindow.__cmp = vi.fn();
      const cmp = makeCmp();
      cmp.load({ locale: 'fr_FR', region: 'EU' });

      await expect(cmp.whenReady()).resolves.toBeUndefined();
      expect(cmp.isError()).toBe(false);
    });

    it('flags an error when cmp:ready never fires', async () => {
      const cmp = makeCmp();
      cmp.load({ locale: 'fr_FR', region: 'EU' });

      await vi.advanceTimersByTimeAsync(CMP_READY_TIMEOUT_MS);

      await expect(cmp.whenReady()).resolves.toBeUndefined();
      expect(cmp.isError()).toBe(true);
    });

    it('flags an error when the loader script fails to load', async () => {
      injectScript.mockImplementationOnce(
        (_src: string, onError: () => void) => {
          onError();
        },
      );
      const cmp = makeCmp();
      cmp.load({ locale: 'fr_FR', region: 'EU' });

      await expect(cmp.whenReady()).resolves.toBeUndefined();
      expect(cmp.isError()).toBe(true);
    });
  });

  describe('consent API', () => {
    it('getConsent returns null while the CMP is not up', () => {
      expect(makeCmp().getConsent()).toBeNull();
    });

    it('getConsent delegates to window.__cmp once up', () => {
      const choices = { analytics: true, marketing: false };
      testWindow.__cmp = vi.fn().mockReturnValue(choices);

      expect(makeCmp().getConsent()).toEqual(choices);
    });

    it('onConsentChange subscribes after cmp:ready and returns an unsubscribe', async () => {
      const cmpUnsubscribe = vi.fn();
      const api = vi.fn().mockReturnValue(cmpUnsubscribe);
      const callback = vi.fn();
      const cmp = makeCmp();
      cmp.load({ locale: 'fr_FR', region: 'EU' });

      const unsubscribe = cmp.onConsentChange(callback);
      expect(api).not.toHaveBeenCalled();

      simulateCmpReady(api);
      await vi.advanceTimersByTimeAsync(0);
      expect(api).toHaveBeenCalledWith('onConsentChange', callback);

      unsubscribe();
      expect(cmpUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('onConsentChange never subscribes when unsubscribed before ready', async () => {
      const api = vi.fn();
      const cmp = makeCmp();
      cmp.load({ locale: 'fr_FR', region: 'EU' });

      cmp.onConsentChange(vi.fn())();

      simulateCmpReady(api);
      await vi.advanceTimersByTimeAsync(0);
      expect(api).not.toHaveBeenCalledWith(
        'onConsentChange',
        expect.anything(),
      );
    });

    it('showPreferences delegates to window.__cmp once up', async () => {
      const api = vi.fn();
      const cmp = makeCmp();
      cmp.load({ locale: 'fr_FR', region: 'EU' });

      cmp.showPreferences();
      simulateCmpReady(api);
      await vi.advanceTimersByTimeAsync(0);

      expect(api).toHaveBeenCalledWith('showPreferences');
    });
  });
});
