import { describe, expect, it } from 'vitest';

import { POLLING_INTERVAL } from '@/data/hooks/grafana/useGrafana.polling';

describe('useGrafana.polling', () => {
  describe('POLLING_INTERVAL', () => {
    it('should be 5000ms', () => {
      expect(POLLING_INTERVAL).toBe(5000);
    });
  });
});
