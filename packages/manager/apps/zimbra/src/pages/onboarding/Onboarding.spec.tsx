import React from 'react';

import { act, fireEvent } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';

import onboardingTranslation from '@/public/translations/onboarding/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

import Onboarding from './Onboarding.page';

describe('Onboarding page', () => {
  it('should display page correctly', () => {
    const { findByText } = render(<Onboarding />);

    const title = findByText(onboardingTranslation.title);
    expect(title).toBeDefined();
  });

  it('should call window open on click', () => {
    const { getByText } = render(<Onboarding />);

    const spy = vi.spyOn(window, 'open');

    const button = getByText(onboardingTranslation.orderButtonLabel);

    act(() => {
      fireEvent.click(button);
    });

    expect(spy).toHaveBeenCalledOnce();
  });
});
