import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import useCheckFeatureAvailability from './useCheckFeatureAvailability';
import { TFeatureStateDetail } from '@/constants';

// Mock the external hook
vi.mock('@ovh-ux/manager-react-components', () => ({
  useFeatureAvailability: vi.fn(),
}));

const mockUseFeatureAvailability = vi.mocked(useFeatureAvailability);

describe('useCheckFeatureAvailability', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return unavailable state when featureState is undefined', () => {
    mockUseFeatureAvailability.mockReturnValue({
      data: undefined,
    } as ReturnType<typeof useFeatureAvailability>);

    const { result } = renderHook(() => useCheckFeatureAvailability(undefined));

    expect(result.current).toEqual({
      available: false,
      feature: '',
      check: false,
    });
    expect(mockUseFeatureAvailability).not.toHaveBeenCalled();
  });

  it('should return unavailable state when featureState has no featureAvailability', () => {
    const featureState: TFeatureStateDetail = {
      featureAvailability: undefined,
    } as TFeatureStateDetail;

    mockUseFeatureAvailability.mockReturnValue({
      data: undefined,
    } as ReturnType<typeof useFeatureAvailability>);

    const { result } = renderHook(() =>
      useCheckFeatureAvailability(featureState),
    );

    expect(result.current).toEqual({
      available: false,
      feature: '',
      check: false,
    });
  });

  it('should return available state when feature is available', () => {
    const featureState: TFeatureStateDetail = {
      featureAvailability: 'test-feature',
    } as TFeatureStateDetail;

    mockUseFeatureAvailability.mockReturnValue(({
      data: { 'test-feature': true },
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    const { result } = renderHook(() =>
      useCheckFeatureAvailability(featureState),
    );

    expect(result.current).toEqual({
      available: true,
      feature: 'test-feature',
      check: true,
    });
    expect(mockUseFeatureAvailability).toHaveBeenCalledWith(['test-feature'], {
      enabled: true,
    });
  });

  it('should return unavailable state when feature is not available', () => {
    const featureState: TFeatureStateDetail = {
      featureAvailability: 'test-feature',
    } as TFeatureStateDetail;

    mockUseFeatureAvailability.mockReturnValue(({
      data: { 'test-feature': false },
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    const { result } = renderHook(() =>
      useCheckFeatureAvailability(featureState),
    );

    expect(result.current).toEqual({
      available: false,
      feature: 'test-feature',
      check: true,
    });
  });

  it('should return unavailable state when availability data is undefined', () => {
    const featureState: TFeatureStateDetail = {
      featureAvailability: 'test-feature',
    } as TFeatureStateDetail;

    mockUseFeatureAvailability.mockReturnValue({
      data: undefined,
    } as ReturnType<typeof useFeatureAvailability>);

    const { result } = renderHook(() =>
      useCheckFeatureAvailability(featureState),
    );

    expect(result.current).toEqual({
      available: false,
      feature: 'test-feature',
      check: true,
    });
  });

  it('should return unavailable state when feature is not in availability data', () => {
    const featureState: TFeatureStateDetail = {
      featureAvailability: 'test-feature',
    } as TFeatureStateDetail;

    mockUseFeatureAvailability.mockReturnValue(({
      data: { 'other-feature': true },
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    const { result } = renderHook(() =>
      useCheckFeatureAvailability(featureState),
    );

    expect(result.current).toEqual({
      available: false,
      feature: 'test-feature',
      check: true,
    });
  });

  it('should handle empty string feature', () => {
    const featureState: TFeatureStateDetail = {
      featureAvailability: '',
    } as TFeatureStateDetail;

    mockUseFeatureAvailability.mockReturnValue({
      data: undefined,
    } as ReturnType<typeof useFeatureAvailability>);

    const { result } = renderHook(() =>
      useCheckFeatureAvailability(featureState),
    );

    expect(result.current).toEqual({
      available: false,
      feature: '',
      check: false,
    });
  });
});
