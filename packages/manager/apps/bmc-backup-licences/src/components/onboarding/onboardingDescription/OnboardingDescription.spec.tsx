import React from 'react';

import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { OnboardingDescription } from '@/components/onboarding/onboardingDescription/OnboardingDescription.component';

const { mockUseTranslation, mockUseOnboardingContent } = vi.hoisted(() => ({
  mockUseTranslation: vi.fn().mockReturnValue({
    t: vi.fn().mockImplementation((key, { productName }) => `translated_${key}_${productName}`),
  }),
  mockUseOnboardingContent: vi.fn(),
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsText: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
}));

// Mock the dependencies
vi.mock('@/hooks/onboarding/useOnboardingData', () => ({
  useOnboardingContent: mockUseOnboardingContent,
}));

vi.mock('react-i18next', () => ({
  useTranslation: mockUseTranslation,
}));

describe('specs:onboarding', () => {
  it('should render component directly', async () => {
    mockUseOnboardingContent.mockReturnValue({
      productName: 'MyTestApp',
      productCategory: 'Category',
      brand: 'BrandExample',
    });

    const { container } = render(<OnboardingDescription />);

    await expect(container).toBeAccessible();

    expect(screen.getByText('translated_onboarding:description_part1_MyTestApp')).toBeVisible();
  });
});
