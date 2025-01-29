import React from 'react';
import { describe, expect } from 'vitest';
import Onboarding from '../index';
import { render } from '@/utils/test.provider';
import onboardingTranslation from '@/public/translations/onboarding/Messages_fr_FR.json';

describe('Onboarding page', () => {
  it('should display page correctly', async () => {
    const { findByText } = render(<Onboarding />);

    const title = await findByText(
      onboardingTranslation.web_office_onboarding_title,
    );
    expect(title).toBeVisible();
  });
});
