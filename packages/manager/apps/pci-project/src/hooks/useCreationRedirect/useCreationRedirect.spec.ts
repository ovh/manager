import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIsAskIncreaseProjectsQuota } from '@/data/hooks/payment/useEligibility';
import useCreationRedirect from './useCreationRedirect';
import { createWrapper } from '@/wrapperRenders';

vi.mock('@/data/hooks/payment/useEligibility', () => ({
  useIsAskIncreaseProjectsQuota: vi.fn(),
}));

const mockUseIsAskIncreaseProjectsQuota = vi.mocked(
  useIsAskIncreaseProjectsQuota,
);

describe('useCreationRedirect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderHookWithWrapper = () => {
    const Wrapper = createWrapper();
    return renderHook(() => useCreationRedirect(), {
      wrapper: Wrapper,
    });
  };

  it('should return loading state when query is loading', () => {
    mockUseIsAskIncreaseProjectsQuota.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      isSuccess: false,
    } as ReturnType<typeof useIsAskIncreaseProjectsQuota>);

    const { result } = renderHookWithWrapper();

    expect(result.current).toEqual({
      shouldRedirectToIncreaseQuota: false,
      isLoading: true,
    });
  });

  it('should return false for shouldRedirectToIncreaseQuota when data is false', () => {
    mockUseIsAskIncreaseProjectsQuota.mockReturnValue({
      data: false,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    } as ReturnType<typeof useIsAskIncreaseProjectsQuota>);

    const { result } = renderHookWithWrapper();

    expect(result.current).toEqual({
      shouldRedirectToIncreaseQuota: false,
      isLoading: false,
    });
  });

  it('should return true for shouldRedirectToIncreaseQuota when data is true', () => {
    mockUseIsAskIncreaseProjectsQuota.mockReturnValue({
      data: true,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    } as ReturnType<typeof useIsAskIncreaseProjectsQuota>);

    const { result } = renderHookWithWrapper();

    expect(result.current).toEqual({
      shouldRedirectToIncreaseQuota: true,
      isLoading: false,
    });
  });

  it('should return false for shouldRedirectToIncreaseQuota when query has error', () => {
    mockUseIsAskIncreaseProjectsQuota.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Test error'),
      isSuccess: false,
    } as ReturnType<typeof useIsAskIncreaseProjectsQuota>);

    const { result } = renderHookWithWrapper();

    expect(result.current).toEqual({
      shouldRedirectToIncreaseQuota: false,
      isLoading: false,
    });
  });

  it('should handle null data gracefully', () => {
    mockUseIsAskIncreaseProjectsQuota.mockReturnValue(({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    } as unknown) as ReturnType<typeof useIsAskIncreaseProjectsQuota>);

    const { result } = renderHookWithWrapper();

    expect(result.current).toEqual({
      shouldRedirectToIncreaseQuota: false,
      isLoading: false,
    });
  });

  it('should return correct loading state when query is loading', () => {
    mockUseIsAskIncreaseProjectsQuota.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      isSuccess: false,
    } as ReturnType<typeof useIsAskIncreaseProjectsQuota>);

    const { result } = renderHookWithWrapper();

    expect(result.current.isLoading).toBe(true);
  });

  it('should return correct loading state when query is not loading', () => {
    mockUseIsAskIncreaseProjectsQuota.mockReturnValue({
      data: false,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    } as ReturnType<typeof useIsAskIncreaseProjectsQuota>);

    const { result } = renderHookWithWrapper();

    expect(result.current.isLoading).toBe(false);
  });

  it('should maintain consistent return structure', () => {
    mockUseIsAskIncreaseProjectsQuota.mockReturnValue({
      data: true,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    } as ReturnType<typeof useIsAskIncreaseProjectsQuota>);

    const { result } = renderHookWithWrapper();

    expect(result.current).toHaveProperty('shouldRedirectToIncreaseQuota');
    expect(result.current).toHaveProperty('isLoading');
    expect(typeof result.current.shouldRedirectToIncreaseQuota).toBe('boolean');
    expect(typeof result.current.isLoading).toBe('boolean');
  });
});
