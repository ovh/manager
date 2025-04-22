import React from 'react';
import { describe, expect, vi } from 'vitest';
import Onboarding from './Onboarding.page';
import { render, act, fireEvent } from '@/utils/test.provider';
import onboardingTranslation from '@/public/translations/onboarding/Messages_fr_FR.json';

describe('Onboarding page', () => {
  it('should display page correctly', async () => {
    const { findByText } = render(<Onboarding />);

    const title = await findByText(onboardingTranslation.title);
    expect(title).toBeVisible();
  });

  it('should call window open on click', async () => {
    const { container } = render(<Onboarding />);

    const spy = vi.spyOn(window, 'open');

    const button = await container.querySelector(
      `ods-button[label="${onboardingTranslation.order_btn}"]`,
    );

    await act(() => {
      fireEvent.click(button);
    });

    expect(spy).toHaveBeenCalledOnce();
  });
});
