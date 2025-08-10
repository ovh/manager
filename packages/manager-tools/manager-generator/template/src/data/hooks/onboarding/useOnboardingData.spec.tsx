import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockedFunction } from 'vitest';

import type { OnboardingConfigType } from '@/types/Onboarding.type';

import { useGuideLinks, useOnboardingContent } from './useOnboardingData';

// -----------------------------------------------------------------------------
// Mocks
// -----------------------------------------------------------------------------

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

// Safe typed mocks
const mockedUseQuery = useQuery as MockedFunction<typeof useQuery>;
const mockedUseTranslation = useTranslation as MockedFunction<typeof useTranslation>;

// Helper: build typed UseQueryResult
function mockQueryData(
  data: Partial<OnboardingConfigType> | undefined,
): UseQueryResult<OnboardingConfigType> {
  return { data } as UseQueryResult<OnboardingConfigType>;
}

describe('useOnboardingData hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseTranslation.mockReturnValue({
      t: (key: string, fallback?: string) => fallback ?? `__${key}__`,
    } as unknown as ReturnType<typeof useTranslation>);
  });

  // ---------------------------------------------------------------------------
  // useOnboardingContent
  // ---------------------------------------------------------------------------

  it('returns content with defaults when API data is missing', () => {
    mockedUseQuery.mockReturnValue(mockQueryData(undefined));

    const { result } = renderHook(() => useOnboardingContent());

    expect(result.current.productName).toBe('Product'); // fallback from t()
    expect(result.current.heroImage).toBeUndefined();
    expect(result.current.tiles).toEqual([]);
  });

  it('maps API data into content correctly', () => {
    mockedUseQuery.mockReturnValue(
      mockQueryData({
        productName: 'CloudX',
        productCategory: 'Compute',
        brand: 'OVHcloud',
        title: 'Welcome to CloudX',
        heroImage: { src: '/img.png', alt: 'Hero alt' },
        tiles: [
          {
            id: 1,
            key: 'Tile1',
            linkKey: 'discover',
          },
        ],
      }),
    );

    const { result } = renderHook(() => useOnboardingContent());

    expect(result.current.productName).toBe('CloudX');
    expect(result.current.productCategory).toBe('Compute');
    expect(result.current.brand).toBe('OVHcloud');
    expect(result.current.title).toBe('Welcome to CloudX');
    expect(result.current.heroImage).toEqual({
      src: '/img.png',
      alt: 'Hero alt',
    });
    expect(result.current.tiles).toEqual([
      {
        id: 1,
        key: 'Tile1',
        linkKey: 'discover',
      },
    ]);
  });

  // ---------------------------------------------------------------------------
  // useGuideLinks
  // ---------------------------------------------------------------------------

  it('returns empty strings when links are missing', () => {
    mockedUseQuery.mockReturnValue(mockQueryData({}));

    const { result } = renderHook(() => useGuideLinks());

    expect(result.current).toEqual({
      discover: '',
      tutorial: '',
      faq: '',
    });
  });

  it('returns API links correctly', () => {
    mockedUseQuery.mockReturnValue(
      mockQueryData({
        links: {
          discover: '/discover',
          tutorial: '/tutorial',
          faq: '/faq',
        },
      }),
    );

    const { result } = renderHook(() => useGuideLinks());

    expect(result.current).toEqual({
      discover: '/discover',
      tutorial: '/tutorial',
      faq: '/faq',
    });
  });
});
