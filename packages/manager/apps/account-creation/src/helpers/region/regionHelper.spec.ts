import { describe, expect, it } from 'vitest';
import { getRegion } from './regionHelper';

describe('regionHelper', () => {
  describe('getRegion', () => {
    it.each([
      ['manager.eu.ovhcloud.com', 'EU'],
      ['manager.ca.ovhcloud.com', 'CA'],
      ['manager.us.ovhcloud.com', 'US'],
      ['unknown', 'EU'],
    ])(
      'should give the correct region for %s hostname',
      async (hostname, region) => {
        Object.defineProperty(window, 'location', {
          value: {
            ...window.location,
            hostname,
          },
          writable: true,
        });
        const parsedRegion = getRegion();
        expect(parsedRegion).toBe(region);
      },
    );
  });
});
