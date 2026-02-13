import { describe, expect, it } from 'vitest';

import { isOctaviaLoadBalancerPlan } from '../productAvailability.service';

describe('productAvailability.service', () => {
  describe('isOctaviaLoadBalancerPlan', () => {
    it.each([
      { planCode: 'octavia-loadbalancer.loadbalancer-s.hour.consumption', expected: true },
      { planCode: 'octavia-loadbalancer.other-plan', expected: true },
      { planCode: 'other-family.octavia-loadbalancer.plan', expected: false },
      { planCode: 'octavia-loadbalancer', expected: false },
      { planCode: '', expected: false },
    ])('returns $expected when planCode is "$planCode"', ({ planCode, expected }) => {
      expect(isOctaviaLoadBalancerPlan(planCode)).toBe(expected);
    });
  });
});
