import {
  useFeatureAvailability,
  UseFeatureAvailabilityResult,
} from '@ovh-ux/manager-react-components';
import { vi, describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGetEncriptionAvailability } from './useGetEncriptionAvailability';

vi.mock('@ovh-ux/manager-react-components', () => ({
  useFeatureAvailability: vi.fn(),
}));

describe('useGetEncriptionAvailability', () => {
  it('should return available as true when feature is available', () => {
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: { 'public-cloud:object-storage:encryption': true },
    } as UseFeatureAvailabilityResult);

    const { result } = renderHook(() => useGetEncriptionAvailability());

    expect(result.current.available).toBe(true);
  });

  it('should return available as false when feature is not available', () => {
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: { 'public-cloud:object-storage:encryption': false },
    } as UseFeatureAvailabilityResult);

    const { result } = renderHook(() => useGetEncriptionAvailability());

    expect(result.current.available).toBe(false);
  });

  it('should return available as false when feature data is undefined', () => {
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: undefined,
    } as UseFeatureAvailabilityResult);

    const { result } = renderHook(() => useGetEncriptionAvailability());

    expect(result.current.available).toBe(false);
  });
});
