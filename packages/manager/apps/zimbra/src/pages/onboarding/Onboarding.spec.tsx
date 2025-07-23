import React from 'react';
import { describe, expect, vi } from 'vitest';
import Onboarding from './Onboarding.page';
import { render, act, fireEvent, waitFor } from '@/utils/test.provider';
import onboardingTranslation from '@/public/translations/onboarding/Messages_fr_FR.json';

describe('Onboarding page', () => {
  it('should display page correctly', async () => {
    const { findByText } = render(<Onboarding />);

    const title = findByText(onboardingTranslation.title);

    await waitFor(() => {
      expect(title).toBeVisible();
    });
  });

  it('should call window open on click', async () => {
    const { container } = render(<Onboarding />);

    const spy = vi.spyOn(window, 'open');

    const button = container.querySelector(
      `ods-button[label="${onboardingTranslation.orderButtonLabel}"]`,
    );

    await act(() => {
      fireEvent.click(button);
    });

    expect(spy).toHaveBeenCalledOnce();
  });
});
