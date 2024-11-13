import React from 'react';
import { waitFor } from '@testing-library/react';
import { render } from '../../../utils/test.provider';
import {
  OnboardingLayout,
  OnboardingLayoutProps,
} from './onboarding.component';
import { defaultProps } from './onboarding.stories';

const setupSpecTest = async (customProps?: Partial<OnboardingLayoutProps>) =>
  waitFor(() =>
    render(<OnboardingLayout {...defaultProps} {...customProps} />),
  );

describe('specs:onboarding', () => {
  it('renders without error', async () => {
    // when
    const { getByText, container } = await setupSpecTest();

    // then
    const title = getByText('Welcome to Onboarding');
    expect(title).toHaveClass('block text-center sm:pt-8 xs:pt-2.5');

    // and
    const orderButton = container.querySelector('[label="Order Now"]');
    expect(orderButton.closest('div')).toHaveClass(
      'flex sm:pt-8 xs:pt-2.5 flex-row items-center space-x-4 justify-center',
    );

    const description = getByText(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    );
    expect(description).toBeVisible();

    const card = getByText('Test Onboarding 1');
    expect(card.closest('aside')).toHaveClass(
      'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 xs:pt-10 sm:pt-20',
    );
  });

  describe('contents', () => {
    it('displays additional content correctly', async () => {
      const customProps: Partial<OnboardingLayoutProps> = {
        title: 'Custom Title',
        description: 'Custom Description',
      };

      const screen = await setupSpecTest(customProps);

      const customTitle = screen.getByText('Custom Title');
      const customDescription = screen.getByText('Custom Description');

      expect(customTitle).toBeTruthy();
      expect(customDescription).toBeTruthy();
    });
  });
});
