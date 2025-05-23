import React from 'react';
import { describe, expect } from 'vitest';
import OnboardingWelcome from './Welcome.page';
import { render } from '@/utils/test.provider';
import onboardingTranslation from '@/public/translations/onboarding/Messages_fr_FR.json';

describe('Onboarding welcome page', () => {
  it('should display page correctly', async () => {
    const { findByText } = render(<OnboardingWelcome />);

    const title = await findByText(onboardingTranslation.welcome_title);
    expect(title).toBeVisible();
  });
});
