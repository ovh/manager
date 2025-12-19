import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { OnboardingConfigType } from '@/types/Onboarding.type';

import { useGuideLinks, useOnboardingContent } from './useOnboardingData';

// --- Mock App.constants ---
vi.mock('@/App.constants', () => {
  const mockConfig: OnboardingConfigType = {
    productName: 'MyProduct',
    productCategory: 'CategoryX',
    brand: 'BrandY',
    title: 'Welcome to MyProduct',
    heroImage: { src: '/hero.png', alt: 'Hero' },
    tiles: [{ id: 1, key: 'discover', linkKey: 'discover' }],
    links: { discover: '/discover', tutorial: '/tutorial', faq: '/faq' },
  };
  return { ONBOARDING_CONFIG: mockConfig };
});

// --- Mock translation ---
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { productName?: string }) =>
      `${key}${opts?.productName ? `:${opts.productName}` : ''}`,
  }),
}));

// --- Helper wrapper with React Query ---
const createWrapper =
  () =>
  // eslint-disable-next-line react/display-name
  ({ children }: { children: ReactNode }) => {
    const client = new QueryClient();
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };

describe('useOnboardingContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns onboarding content with hero image and tiles', async () => {
    const { result } = renderHook(() => useOnboardingContent(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.productName).toBe('MyProduct');
      expect(result.current.productCategory).toBe('CategoryX');
      expect(result.current.brand).toBe('BrandY');
      expect(result.current.heroImage?.src).toBe('/hero.png');
      expect(result.current.tiles).toHaveLength(1);
    });
  });

  it('falls back when productName is missing', async () => {
    vi.doMock('@/App.constants', () => ({
      ONBOARDING_CONFIG: {
        productCategory: 'X',
        brand: 'Y',
        tiles: [],
        links: {},
      } as unknown as Partial<OnboardingConfigType>,
    }));

    const { result } = renderHook(() => useOnboardingContent(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.productName).toContain('onboarding:productDefaultName');
    });
  });
});

describe('useGuideLinks', () => {
  it('returns guide links correctly', async () => {
    const { result } = renderHook(() => useGuideLinks(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.discover).toBe('/discover');
      expect(result.current.tutorial).toBe('/tutorial');
      expect(result.current.faq).toBe('/faq');
    });
  });
});
