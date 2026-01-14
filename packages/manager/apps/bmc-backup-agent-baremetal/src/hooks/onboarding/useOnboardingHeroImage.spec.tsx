import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useOnboardingHeroImage } from './useOnboardingHeroImage';

const { mockUseTranslation, mockUseOnboardingContent } = vi.hoisted(() => ({
  mockUseTranslation: vi.fn().mockReturnValue({
    t: vi.fn().mockImplementation((key, { productName }) => `translated_${key}_${productName}`),
  }),
  mockUseOnboardingContent: vi.fn(),
}));

// Mock the dependencies
vi.mock('@/hooks/onboarding/useOnboardingData', () => ({
  useOnboardingContent: mockUseOnboardingContent,
}));

vi.mock('react-i18next', () => ({
  useTranslation: mockUseTranslation,
}));

describe('useOnboardingHeroImage', () => {
  it.each([
    {
      description: 'useOnboardingHeroImage should return the correct hero image gived',
      onboardingContent: {
        productName: 'MyTestApp',
        heroImage: { src: '/hero.png', alt: 'Hero', width: 300 },
      },
      expected: { src: '/hero.png', alt: 'Hero', width: 300 },
    },
    {
      description:
        'useOnboardingHeroImage should return the translated alt text if no alt is provided',
      onboardingContent: {
        productName: 'MyTestApp',
        heroImage: { src: '/hero.png' },
      },
      expected: {
        src: '/hero.png',
        alt: 'translated_onboarding:hero_alt_MyTestApp',
        width: 300,
      },
    },
    {
      description: 'useOnboardingHeroImage should return undefined if no hero image is provided',
      onboardingContent: {
        productName: 'MyTestApp',
      },
      expected: undefined,
    },
  ])('$description', ({ onboardingContent, expected }) => {
    mockUseOnboardingContent.mockReturnValue(onboardingContent);
    const { result } = renderHook(() => useOnboardingHeroImage());
    expect(result.current).toEqual(expected);
  });
});
