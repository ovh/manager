import '@testing-library/jest-dom';
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
    const screen = await setupSpecTest();
    const title = screen.getByText('Welcome to Onboarding');
    const orderButton = screen.getByText('Order Now');
    const description = screen.getByText(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    );

    expect(title).toBeTruthy();
    expect(orderButton).toBeTruthy();
    expect(description).toBeTruthy();
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
