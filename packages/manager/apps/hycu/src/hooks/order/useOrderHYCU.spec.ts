import { describe, expect, it, test, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import useOrderHYCU from './useOrderHYCU';

vi.mock('@ovh-ux/manager-module-order', () => ({
  useOrderURL: () => 'http://test',
  getHYCUProductSettings: () => 'test-settings',
}));

describe('get hycu express order linl ', () => {
  const useCases: {
    planCode: string;
    region: string;
  }[] = [
    {
      planCode: 'hycu-cloud-vm-pack-25',
      region: 'FR',
    },
    {
      planCode: 'hycu-cloud-vm-pack-250',
      region: 'US',
    },
  ];
  test.each(useCases)(
    'should return the right translation key for $type',
    ({ planCode, region }) => {
      // given type and translationKey
      // when
      const { result } = renderHook(() => useOrderHYCU({ planCode, region }));
      // then
      expect(result.current.orderLink).toContain(
        'http://test?products=~(test-settings)',
      );
    },
  );
  it('should return null if planCode is not defined', () => {
    // given
    const planCode = undefined;
    const region = 'FR';
    // when
    const { result } = renderHook(() => useOrderHYCU({ planCode, region }));

    // then
    expect(result.current.orderLink).toBeNull();
  });
});
