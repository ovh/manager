import { describe, expect, it } from 'vitest';

/**
 * Records every cookie the page tries to write. Piano marks its cookies
 * `Secure`, which jsdom (http://localhost) rejects, so `document.cookie`
 * cannot be read back to observe them.
 */
const recordCookieWrites = (): string[] => {
  const native = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
  const writes: string[] = [];
  Object.defineProperty(document, 'cookie', {
    configurable: true,
    get: () => native.get.call(document),
    set: (value: string) => {
      writes.push(value);
      native.set.call(document, value);
    },
  });
  return writes;
};

const piano = () => (window as any).pa;

describe('piano-override', () => {
  // The Piano SDK only runs once per test file (dependencies are not reset
  // between tests), so the whole scenario runs on a single SDK instance.
  it('keeps the Piano SDK from storing pa_privacy until consent is given', async () => {
    const writes = recordCookieWrites();

    await import('./piano-override');
    expect(window._pac.privacyDefaultMode).toBe('no-storage');

    await import('piano-analytics-js/dist/browser/piano-analytics.js');
    expect(piano().privacy.getMode()).toBe('no-storage');
    expect(writes.filter((w) => w.startsWith('pa_privacy='))).toEqual([]);

    // What OvhAtInternet.onUserConsentFromModal(true) does.
    piano().privacy.setMode('optin');
    expect(piano().privacy.getMode()).toBe('optin');
    expect(writes.some((w) => w.startsWith('pa_privacy=%22optin%22'))).toBe(
      true,
    );
  });
});
