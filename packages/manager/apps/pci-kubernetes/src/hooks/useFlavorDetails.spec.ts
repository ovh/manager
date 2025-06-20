import { renderHook } from '@testing-library/react';
import { describe, it, vi, beforeEach, afterEach, expect, test } from 'vitest';

import useFlavorDetails, {
  getPriceByDesiredScale,
} from './useMergedFlavorById';

import { TComputedKubeFlavor } from '@/components/flavor-selector/FlavorSelector.component';
import { useMergedKubeFlavors } from './useFlavors';
import { wrapper } from '@/wrapperRenders';

vi.mock('./useFlavors', () => ({
  ...vi.importActual('./useFlavors'),
  useMergedKubeFlavors: vi.fn(),
}));

describe('getPrice', () => {
  test.each([
    [undefined, undefined, 0, undefined],
    [0, 100, 2, undefined],
    [1, undefined, 2, { hour: 2, month: undefined }],
    [1, 10, 2, { hour: 2, month: 20 }],
    [5, 50, 3, { hour: 15, month: 150 }],
  ])(
    'getPrice(%p, %p, %p) should return %p',
    (hour, month, desiredScaling, expected) => {
      expect(getPriceByDesiredScale(hour, month, desiredScaling)).toEqual(
        expected,
      );
    },
  );
});

describe('useFlavorDetails', () => {
  const mockFlavors = [
    {
      id: 'flavor-1',
      name: 'Flavor 1',
      vcpus: 2,
      ram: 4096,
      pricingsHourly: { price: 0.05 },
      pricingsMonthly: { price: 30 },
    },
    {
      id: 'flavor-2',
      name: 'Flavor 2',
      vcpus: 4,
      ram: 8192,
      pricingsHourly: { price: 0.1 },
      pricingsMonthly: { price: 60 },
    },
  ] as TComputedKubeFlavor[];

  beforeEach(() => {
    vi.mocked(useMergedKubeFlavors).mockReturnValue({
      mergedFlavors: mockFlavors,
      isPending: false,
    } as { mergedFlavors: TComputedKubeFlavor[]; isPending: boolean });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return flavor details with computed price', async () => {
    const { result } = renderHook(
      () =>
        useFlavorDetails('project-1', 'GRA', 'flavor-1', {
          select: (flavor) => ({
            ...flavor,
            price: getPriceByDesiredScale(
              flavor.pricingsHourly?.price,
              flavor.pricingsMonthly?.price,
              3,
            ),
          }),
        }),
      { wrapper },
    );

    expect(result.current).toEqual({
      id: 'flavor-1',
      name: 'Flavor 1',
      vcpus: 2,
      ram: 4096,
      pricingsHourly: { price: 0.05 },
      pricingsMonthly: { price: 30 },
      price: {
        hour: 0.05 * 3,
        month: 30 * 3,
      },
    });
  });

  it('should return undefined price if desiredScaling is 0', () => {
    const { result } = renderHook(
      () =>
        useFlavorDetails('project-1', 'GRA', 'flavor-2', {
          select: (flavor) => ({ ...flavor, price: getPriceByDesiredScale(0) }),
        }),
      { wrapper },
    );

    expect(result.current).toEqual({
      id: 'flavor-2',
      name: 'Flavor 2',
      vcpus: 4,
      ram: 8192,
      pricingsHourly: { price: 0.1 },
      pricingsMonthly: { price: 60 },
      price: undefined,
    });
  });

  it('should return null if flavor not found', () => {
    const { result } = renderHook(
      () => useFlavorDetails('project-1', 'GRA', 'unknown-flavor'),
      { wrapper },
    );

    expect(result.current).toBeNull();
  });
});
