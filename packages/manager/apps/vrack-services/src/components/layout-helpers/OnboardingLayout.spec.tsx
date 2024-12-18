// V Should be first V
import '@/test-utils/setupTests';
// -----
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { getButtonByLabel } from '@ovh-ux/manager-core-test-utils';
import {
  OnboardingLayout,
  OnboardingLayoutProps,
} from './OnboardingLayout.component';

const primaryButtonClickMock = vi.fn();
const secondaryButtonClickMock = vi.fn();

const renderComponent = ({ ...args }: OnboardingLayoutProps) => {
  return render(<OnboardingLayout {...args} />);
};

describe('OnboardingLayout Component', () => {
  it('Shoudl display ctas', async () => {
    const { container, getByText } = renderComponent({
      title: 'onboarding-title',
      description: 'onboarding-description',
      intro: 'onboarding-intro',
      introTitle: 'onboarding-intro-title',
      primaryButtonLabel: 'onboarding-button-label',
      primaryOnClick: primaryButtonClickMock,
      secondaryButtonLabel: 'onboarding-secondary-button-label',
      secondaryOnClick: secondaryButtonClickMock,
    });

    const title = getByText('onboarding-title');
    expect(title).toBeDefined();
    expect(title).toHaveAttribute('size', ODS_TEXT_SIZE._600);

    const description = getByText('onboarding-description');
    expect(description).toBeDefined();

    const intro = getByText('onboarding-intro');
    expect(intro).toBeDefined();

    const introTitle = getByText('onboarding-intro-title');
    expect(introTitle).toBeDefined();
    expect(introTitle).toHaveAttribute('size', ODS_TEXT_SIZE._600);

    const primaryButton = await getButtonByLabel({
      label: 'onboarding-button-label',
      container,
    });
    expect(primaryButton).toBeDefined();

    await act(() => {
      return fireEvent.click(primaryButton);
    });

    expect(primaryButtonClickMock).toHaveBeenCalledOnce();

    const secondaryButton = await getButtonByLabel({
      label: 'onboarding-secondary-button-label',
      container,
    });
    expect(secondaryButton).toBeDefined();

    await act(() => {
      return fireEvent.click(secondaryButton);
    });

    expect(secondaryButtonClickMock).toHaveBeenCalledOnce();
  });

  it('should display disabled cta', async () => {
    const { container } = renderComponent({
      title: 'onboarding-title',
      primaryButtonLabel: 'onboarding-button-label',
      primaryOnClick: primaryButtonClickMock,
      primaryButtonDisabled: true,
      secondaryButtonLabel: 'onboarding-secondary-button-label',
      secondaryOnClick: secondaryButtonClickMock,
      secondaryButtonDisabled: true,
    });

    await getButtonByLabel({
      label: 'onboarding-button-label',
      container,
      disabled: true,
    });
    await getButtonByLabel({
      label: 'onboarding-secondary-button-label',
      container,
      disabled: true,
    });
  });
});
