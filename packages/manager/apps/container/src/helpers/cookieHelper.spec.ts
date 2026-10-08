import { afterEach, describe, expect, it, vi } from 'vitest';
import { deleteCookieOnAllDomains } from './cookieHelper';

describe('deleteCookieOnAllDomains', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('expires the cookie on the host and on every parent domain', () => {
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      hostname: 'manager.eu.ovhcloud.com',
    });
    const writes: string[] = [];
    vi.spyOn(document, 'cookie', 'set').mockImplementation((value) => {
      writes.push(value);
    });

    deleteCookieOnAllDomains('pa_privacy');

    expect(writes).toHaveLength(3);
    expect(writes[0]).not.toContain('domain=');
    expect(writes[1]).toContain('domain=.eu.ovhcloud.com;');
    expect(writes[2]).toContain('domain=.ovhcloud.com;');
    writes.forEach((write) => {
      expect(write).toMatch(/^pa_privacy=; path=\/;/);
      expect(write).toContain('expires=Thu, 01 Jan 1970');
    });
  });

  it('removes the cookie on a single-label host', () => {
    document.cookie = 'pa_privacy=optin; path=/';

    deleteCookieOnAllDomains('pa_privacy');

    expect(document.cookie).not.toContain('pa_privacy');
  });
});
