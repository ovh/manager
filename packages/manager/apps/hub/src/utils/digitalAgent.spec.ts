import { describe, expect, it } from 'vitest';

import { isDigitalAgentEnabled } from './digitalAgent';

describe('isDigitalAgentEnabled', () => {
  it('is enabled for FR customers on the EU manager', () => {
    expect(isDigitalAgentEnabled('EU', 'FR')).toBe(true);
  });

  it('is disabled for the other subsidiaries of the EU manager', () => {
    ['GB', 'DE', 'ES', 'IT', 'PL', 'PT', 'MA', 'SN', 'TN', 'NL', 'IE'].forEach((subsidiary) => {
      expect(isDigitalAgentEnabled('EU', subsidiary)).toBe(false);
    });
  });

  it('is disabled on the other managers', () => {
    expect(isDigitalAgentEnabled('CA', 'FR')).toBe(false);
    expect(isDigitalAgentEnabled('US', 'FR')).toBe(false);
  });
});
