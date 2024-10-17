import React from 'react';
import { describe, expect, vi } from 'vitest';
import Onboarding from '../index';
import { render, act, fireEvent } from '@/utils/test.provider';
import onboardingTranslation from '@/public/translations/onboarding/Messages_fr_FR.json';

describe('Onboarding page', () => {
  it('should display page correctly', async () => {
    const { findByText } = render(<Onboarding />);

    const title = await findByText(onboardingTranslation.title);
    expect(title).toBeVisible();
  });

  it('should call window open on click', async () => {
    const { findByText } = render(<Onboarding />);

    const spy = vi.spyOn(window, 'open');

    const button = await findByText(onboardingTranslation.orderButtonLabel);

    await act(() => {
      fireEvent.click(button);
    });

    expect(spy).toHaveBeenCalledOnce();
  });
});
