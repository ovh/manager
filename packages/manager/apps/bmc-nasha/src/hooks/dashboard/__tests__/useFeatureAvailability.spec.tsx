import React, { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

import { useDashboardFeatureAvailability } from '../useFeatureAvailability';

// Mock dependencies
vi.mock('@ovh-ux/manager-react-components', () => ({
  useFeatureAvailability: vi.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useDashboardFeatureAvailability', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('should return feature availability flags correctly', () => {
    const mockData = {
      'billing:commitment': true,
      'dedicated-nasha:eol-lv1-lv2': false,
    };

    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useDashboardFeatureAvailability(), { wrapper });

    expect(result.current.isCommitmentAvailable).toBe(true);
    expect(result.current.isNashaLegacyServicesPeriod).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should return false when features are not available', () => {
    const mockData = {
      'billing:commitment': false,
      'dedicated-nasha:eol-lv1-lv2': false,
    };

    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useDashboardFeatureAvailability(), { wrapper });

    expect(result.current.isCommitmentAvailable).toBe(false);
    expect(result.current.isNashaLegacyServicesPeriod).toBe(false);
  });

  it('should return false when data is undefined', () => {
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useDashboardFeatureAvailability(), { wrapper });

    expect(result.current.isCommitmentAvailable).toBe(false);
    expect(result.current.isNashaLegacyServicesPeriod).toBe(false);
  });

  it('should handle loading state', () => {
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useDashboardFeatureAvailability(), { wrapper });

    expect(result.current.isLoading).toBe(true);
  });
});

