import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createWrapper, shellContext } from '@/wrapperRenders';
import {
  useIsAValidHdsSupportLevel,
  useIsHdsFeatureAvailabilityEnabled,
} from './useHds';

vi.mock('@/data/api/services', () => ({
  getServiceId: vi.fn(),
  getServiceOptions: vi.fn(),
  getCartServiceOption: vi.fn(),
}));

vi.mock('@/data/api/payment', () => ({
  payWithRegisteredPaymentMean: vi.fn(),
}));

describe('useHds hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useIsHdsFeatureAvailabilityEnabled returns true if feature is available', () => {
    vi.mocked(useFeatureAvailability).mockReturnValue(({
      data: { 'public-cloud:hds': true },
      error: null,
      isError: false,
      isSuccess: true,
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    const { result } = renderHook(() => useIsHdsFeatureAvailabilityEnabled(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBe(true);
  });

  it('useIsHdsFeatureAvailabilityEnabled returns false if feature is not available', () => {
    vi.mocked(useFeatureAvailability).mockReturnValue(({
      data: { 'public-cloud:hds': false },
      isLoading: false,
      isSuccess: true,
      status: 'success',
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    const { result } = renderHook(() => useIsHdsFeatureAvailabilityEnabled(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBe(false);
  });

  it('useIsAValidHdsSupportLevel returns true for enterprise or business', () => {
    const customContext = {
      ...shellContext,
      environment: {
        ...shellContext.environment,
        getUser: () => ({ supportLevel: { level: 'enterprise' } }),
      },
    };

    const { result: resultEnterprise } = renderHook(
      () => useIsAValidHdsSupportLevel(),
      {
        wrapper: createWrapper(
          (customContext as unknown) as typeof shellContext,
        ),
      },
    );

    expect(resultEnterprise.current).toBe(true);

    const customContext2 = {
      ...shellContext,
      environment: {
        ...shellContext.environment,
        getUser: () => ({ supportLevel: { level: 'business' } }),
      },
    };

    const { result: resultBusiness } = renderHook(
      () => useIsAValidHdsSupportLevel(),
      {
        wrapper: createWrapper(
          (customContext2 as unknown) as typeof shellContext,
        ),
      },
    );

    expect(resultBusiness.current).toBe(true);
  });

  it('useIsAValidHdsSupportLevel returns false for other levels', () => {
    const customContext = {
      ...shellContext,
      environment: {
        ...shellContext.environment,
        getUser: () => ({ supportLevel: { level: 'basic' } }),
      },
    };
    const { result } = renderHook(() => useIsAValidHdsSupportLevel(), {
      wrapper: createWrapper((customContext as unknown) as typeof shellContext),
    });
    expect(result.current).toBe(false);
  });
});
