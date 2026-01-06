import { describe, expect, it } from 'vitest';

import { isLabeuEnvironment, isProdEnvironment } from '../environment';

describe('environment utils', () => {
  describe('isProdEnvironment', () => {
    it.each([
      'manager.ca.ovhcloud.com',
      'manager.us.ovhcloud.com',
      'manager.eu.ovhcloud.com',
      'ca.ovhcloud.com',
      'us.ovhcloud.com',
      'eu.ovhcloud.com',
    ])('returns true when hostname is "%s"', (hostname) => {
      expect(isProdEnvironment(hostname)).toBe(true);
    });

    it.each(['manager.fr.ovhcloud.com', 'localhost', 'ovhcloud.com'])(
      'returns false when hostname is "%s"',
      (hostname) => {
        expect(isProdEnvironment(hostname)).toBe(false);
      },
    );
  });

  describe('isLabeuEnvironment', () => {
    it.each(['manager.labeu.ovhcloud.com', 'foo.labeu.bar'])(
      'returns true when hostname is "%s"',
      (hostname) => {
        expect(isLabeuEnvironment(hostname)).toBe(true);
      },
    );

    it.each(['manager.eu.ovhcloud.com', 'labeu.ovhcloud.com'])(
      'returns false when hostname is "%s"',
      (hostname) => {
        expect(isLabeuEnvironment(hostname)).toBe(false);
      },
    );
  });
});
