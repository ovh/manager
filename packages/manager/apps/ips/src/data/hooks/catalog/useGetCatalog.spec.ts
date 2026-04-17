import { getRirFromPlanCode } from './useGetCatalog';

describe('getRirFromPlanCode', () => {
  it.each([
    { planCode: 'byoip-failover-v4-arin', expected: 'ARIN' },
    { planCode: 'byoip-failover-v4-ripe', expected: 'RIPE' },
    { planCode: 'byoip-failover-v4-apnic', expected: 'APNIC' },
    { planCode: 'byoip-failover-v4', expected: '' },
    { planCode: 'unrelated-plan-code', expected: '' },
    { planCode: '', expected: '' },
    { planCode: undefined as unknown as string, expected: '' },
  ])('$planCode => $expected', ({ planCode, expected }) => {
    expect(getRirFromPlanCode(planCode)).toBe(expected);
  });
});
