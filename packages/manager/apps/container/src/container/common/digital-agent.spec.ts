import { describe, expect, it } from 'vitest';
import { DIGITAL_AGENT_URL, isDigitalAgentEnabled } from './digital-agent';

describe('digital-agent', () => {
  it('targets the Manager V7 digital agent', () => {
    expect(DIGITAL_AGENT_URL).toBe('/beta/#/support/digital-agent');
  });

  it('is enabled for FR customers on the EU manager', () => {
    expect(isDigitalAgentEnabled('EU', 'FR')).toBe(true);
  });

  it('is disabled for the other subsidiaries of the EU manager', () => {
    ['GB', 'DE', 'ES', 'IT', 'PL', 'PT', 'MA', 'SN', 'TN', 'NL', 'IE'].forEach(
      (subsidiary) => {
        expect(isDigitalAgentEnabled('EU', subsidiary)).toBe(false);
      },
    );
  });

  it('is disabled on the other managers', () => {
    expect(isDigitalAgentEnabled('CA', 'FR')).toBe(false);
    expect(isDigitalAgentEnabled('US', 'FR')).toBe(false);
  });
});
