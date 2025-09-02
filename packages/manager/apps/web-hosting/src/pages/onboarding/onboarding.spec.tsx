import { describe, expect, vi } from 'vitest';

import onboardingTranslation from '@/public/translations/onboarding/Messages_fr_FR.json';
import { act, fireEvent, render } from '@/utils/test.provider';

import Onboarding from './Onboarding.page';

describe('Onboarding page', () => {
  it('should display page correctly', () => {
    const { getByText } = render(<Onboarding />);
    const title = getByText(onboardingTranslation.title);
    expect(title).toBeVisible();
  });

  it('should call window open on click', () => {
    const { container } = render(<Onboarding />);
    const spy = vi.spyOn(window, 'open');
    const button = container.querySelector(
      `ods-button[label="${onboardingTranslation.order_btn}"]`,
    );
    act(() => {
      fireEvent.click(button);
    });
    expect(spy).toHaveBeenCalledOnce();
  });
});
