import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as api from '@/data/api/onboarding/Onboarding.api';
import type { OnboardingConfigType } from '@/types/Onboarding.type';
import { QueryClientWrapper } from '@/utils/Test.utils';

import { useGuideLinks, useOnboardingContent } from './useOnboarding';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue ?? key,
  }),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

const fullConfig: OnboardingConfigType = {
  productName: 'My Product',
  productCategory: 'Cloud',
  brand: 'MyBrand',
  title: 'Welcome to My Product',
  heroImage: { src: '/assets/hero.svg', alt: 'Hero alt' },
  tiles: [
    { id: 1, key: 'tile1', linkKey: 'discover' },
    { id: 2, key: 'tile2', linkKey: 'faq' },
  ],
  links: {
    discover: '/discover',
    tutorial: '/tutorial',
    faq: '/faq',
  },
};

describe('useOnboardingContent', () => {
  it('returns full data from API', async () => {
    vi.spyOn(api, 'getOnboardingConfig').mockResolvedValue(fullConfig);

    const { result } = renderHook(() => useOnboardingContent(), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.productName).toBe('My Product');
    });

    expect(result.current.heroImage?.src).toBe('/assets/hero.svg');
    expect(result.current.tiles).toHaveLength(2);
  });

  it('returns defaults when optional fields are missing', async () => {
    const minimalConfig: OnboardingConfigType = {
      productName: '',
      tiles: [],
      links: { discover: '', tutorial: '', faq: '' },
    };
    vi.spyOn(api, 'getOnboardingConfig').mockResolvedValue(minimalConfig);

    const { result } = renderHook(() => useOnboardingContent(), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.productName).toBe('Product'); // from mocked t()
    });
    expect(result.current.heroImage).toBeUndefined();
    expect(result.current.tiles).toEqual([]);
  });

  it('handles no data gracefully (error path)', async () => {
    vi.spyOn(api, 'getOnboardingConfig').mockRejectedValue(new Error('no data'));

    const { result } = renderHook(() => useOnboardingContent(), { wrapper: QueryClientWrapper });

    await waitFor(() => expect(result.current.productName).toBe('Product')); // default from mocked t()
    expect(result.current.heroImage).toBeUndefined();
    expect(result.current.tiles).toEqual([]);
  });
});

describe('useGuideLinks', () => {
  it('returns links from API', async () => {
    vi.spyOn(api, 'getOnboardingConfig').mockResolvedValue(fullConfig);

    const { result } = renderHook(() => useGuideLinks(), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.discover).toBe('/discover');
    });
  });

  it('returns empty strings when links missing', async () => {
    const noLinks: OnboardingConfigType = {
      productName: 'X',
      tiles: [],
      links: { discover: '', tutorial: '', faq: '' },
    };
    vi.spyOn(api, 'getOnboardingConfig').mockResolvedValue(noLinks);

    const { result } = renderHook(() => useGuideLinks(), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.faq).toBe('');
    });
  });
});
