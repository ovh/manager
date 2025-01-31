import {
  useFeatureAvailability,
  UseFeatureAvailabilityResult,
} from '@ovh-ux/manager-react-components';
import { vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { FEATURE_REGION_1AZ, useIs1AZ } from './useIs1AZ';

vi.mock('@ovh-ux/manager-react-components');

describe('useIs1AZ', () => {
  it('should return false if data is undefined', () => {
    vi.mocked(useFeatureAvailability).mockImplementationOnce(
      () =>
        ({
          data: undefined,
          isLoading: true,
        } as UseFeatureAvailabilityResult),
    );

    const { result } = renderHook(() => useIs1AZ());
    expect(result.current).toBe(false);
  });

  it('should return false if feature is set to false', () => {
    vi.mocked(useFeatureAvailability).mockImplementationOnce(
      (features) =>
        ({
          data: {
            ...Object.fromEntries(features.map((feature) => [feature, false])),
            [FEATURE_REGION_1AZ]: false,
          },
          isLoading: false,
        } as UseFeatureAvailabilityResult),
    );

    const { result } = renderHook(() => useIs1AZ());
    expect(result.current).toBe(false);
  });

  it('should return true if feature is set to true', () => {
    vi.mocked(useFeatureAvailability).mockImplementationOnce(
      (features) =>
        ({
          data: {
            ...Object.fromEntries(features.map((feature) => [feature, false])),
            [FEATURE_REGION_1AZ]: true,
          },
          isLoading: false,
        } as UseFeatureAvailabilityResult),
    );

    const { result } = renderHook(() => useIs1AZ());
    expect(result.current).toBe(true);
  });
});
