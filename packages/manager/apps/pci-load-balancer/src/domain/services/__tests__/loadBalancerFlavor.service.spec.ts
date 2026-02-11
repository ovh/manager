import { describe, expect, it } from 'vitest';

import { TLoadBalancerSizeCode, mapFlavorSizeToLabel } from '../loadBalancer.service';

describe('loadBalancer.service', () => {
  describe('mapFlavorSizeToLabel', () => {
    it.each<{ size: TLoadBalancerSizeCode; expected: string }>([
      { size: 's', expected: 'small' },
      { size: 'm', expected: 'medium' },
      { size: 'l', expected: 'large' },
      { size: 'xl', expected: 'xl' },
    ])('maps $size to $expected', ({ size, expected }) => {
      expect(mapFlavorSizeToLabel(size)).toBe(expected);
    });

    it('returns the input string as-is when not in SIZE_TO_LABEL', () => {
      expect(mapFlavorSizeToLabel('unknown')).toBe('unknown');
      expect(mapFlavorSizeToLabel('')).toBe('');
      expect(mapFlavorSizeToLabel('xxl')).toBe('xxl');
    });
  });
});
