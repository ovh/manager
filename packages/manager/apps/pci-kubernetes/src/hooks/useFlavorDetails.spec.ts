import { renderHook } from '@testing-library/react-hooks';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useMergedKubeFlavors } from './useFlavors';
import useMergedFlavorById, { getPriceByDesiredScale } from './useMergedFlavorById';

const mockFlavors = [
  { id: 'flavor-1', name: 'Small', cpu: 2 },
  { id: 'flavor-2', name: 'Medium', cpu: 4 },
];

vi.mock('./useFlavors', () => ({
  ...vi.importActual('./useFlavors'),
  useMergedKubeFlavors: vi.fn(),
}));

describe('getPriceByDesiredScale', () => {
  it('should return null if hour or desiredScaling is not provided', () => {
    expect(getPriceByDesiredScale(undefined, 100, 2)).toBeNull();
  });

  it('should calculate hour and month prices correctly', () => {
    expect(getPriceByDesiredScale(10, 100, 3)).toEqual({
      hour: 30,
      month: 300,
    });
    expect(getPriceByDesiredScale(10, 100)).toEqual({ hour: 0, month: 0 });
    expect(getPriceByDesiredScale(10, 100, 0)).toEqual({ hour: 0, month: 0 });
  });

  it('should handle undefined month price', () => {
    expect(getPriceByDesiredScale(5, undefined, 2)).toEqual({
      hour: 10,
      month: undefined,
    });
  });
});

describe('useMergedFlavorById', () => {
  beforeEach(() => {
    vi.mocked(useMergedKubeFlavors).mockReturnValue({
      mergedFlavors: mockFlavors,
    } as unknown as ReturnType<typeof useMergedKubeFlavors>);
  });

  it('should return the flavor matching the ID', () => {
    const { result } = renderHook(() => useMergedFlavorById('project-1', 'region-1', 'flavor-2'));

    expect(result.current).toEqual({ id: 'flavor-2', name: 'Medium', cpu: 4 });
  });

  it('should return null if flavor not found', () => {
    const { result } = renderHook(() =>
      useMergedFlavorById('project-1', 'region-1', 'non-existent'),
    );

    expect(result.current).toBeNull();
  });

  it('should return transformed flavor using select option', () => {
    const { result } = renderHook(() =>
      useMergedFlavorById('project-1', 'region-1', 'flavor-1', {
        select: (f) => f.name,
      }),
    );

    expect(result.current).toBe('Small');
  });
});
