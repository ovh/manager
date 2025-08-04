import { renderHook } from '@testing-library/react';
import { useCatalog } from '@ovh-ux/manager-pci-common';
import { describe, it, expect, vi } from 'vitest';
import usePlanData from './usePlanData';

vi.mock('@ovh-ux/manager-pci-common', () => ({
  ...vi.importActual('@ovh-ux/manager-pci-common'),
  useCatalog: vi.fn(),
}));

describe('usePlanData', () => {
  it('should return plans with price 200000 and isPending as false', () => {
    vi.mocked(useCatalog).mockReturnValue({
      data: {
        addons: [
          {
            planCode: 'mks.free.hour.consumption',
            pricings: [{ price: 0 }],
          },
          {
            planCode: 'mks.standard.hour.consumption.3az',
            pricings: [{ price: 123 }],
          },
          {
            planCode: 'mks.standard.hour.consumption.4az',
            pricings: [{ price: 123 }],
          },
        ],
      },
      isPending: false,
    } as ReturnType<typeof useCatalog>);

    const { result } = renderHook(() => usePlanData());

    expect(result.current.isPending).toBe(false);
    expect(result.current.plans).toHaveLength(2);
    expect(result.current.plans[0].price).toBe(0);
    expect(result.current.plans[1].price).toBe(123);
  });
});
