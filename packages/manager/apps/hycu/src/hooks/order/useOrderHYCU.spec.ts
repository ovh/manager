import { describe, expect, it, test, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import useOrderHYCU from './useOrderHYCU';

vi.mock('@ovh-ux/manager-module-order', () => ({
  useOrderURL: () => 'https://test',
  getHYCUProductSettings: () => 'test-settings',
}));

describe('get hycu express order linl ', () => {
  const useCases: {
    planCode: string;
    region: OvhSubsidiary;
  }[] = [
    {
      planCode: 'hycu-cloud-vm-pack-25',
      region: OvhSubsidiary.FR,
    },
    {
      planCode: 'hycu-cloud-vm-pack-250',
      region: OvhSubsidiary.US,
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
        'https://test?products=~(test-settings)',
      );
    },
  );
  it('should return null if planCode is not defined', () => {
    // given
    const region = OvhSubsidiary.FR;
    // when
    const { result } = renderHook(() =>
      useOrderHYCU({ planCode: null, region }),
    );

    // then
    expect(result.current.orderLink).toBeNull();
  });
});
