import React from 'react';

import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { Card } from '@ovh-ux/manager-react-components';

import { testWrapperBuilder } from '@/utils/tests/testWrapperBuilder';

import { OnboardingLayout, OnboardingLayoutProps } from './OnboardingLayout.component';

vi.mock('react-router-dom', () => ({
  Link: ({ to, children, ...props }: { to: string; children: React.ReactNode }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

const defaultProps: OnboardingLayoutProps = {
  title: 'Welcome to Onboarding',
  orderHref: 'https://example.com/order',
  orderButtonLabel: 'Order Now',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  moreInfoHref: 'https://example.com/more-info',
  img: {
    src: 'test.png',
  },
  moreInfoButtonLabel: 'Learn More',
  children: (
    <>
      <Card
        href={''}
        texts={{
          title: 'Test Onboarding 1',
          description: 'This is the description 1',
          category: 'WEB',
        }}
      />
      <Card
        href={''}
        texts={{
          title: 'Test Onboarding 2',
          description: 'This is the description 2',
          category: 'CLOUD',
        }}
      />
      <Card
        href={''}
        texts={{
          title: 'Test Onboarding  3',
          description: 'This is the description 3',
          category: 'TELECOM',
        }}
      />
    </>
  ),
};

const setupSpecTest = async (customProps?: Partial<OnboardingLayoutProps>) =>
  render(<OnboardingLayout {...defaultProps} {...customProps} />, {
    wrapper: await testWrapperBuilder().withShellContext().build(),
  });

describe('specs:onboarding', () => {
  it('renders without error', async () => {
    // when
    const { getByText, container } = await setupSpecTest();

    // then
    const title = getByText('Welcome to Onboarding');
    expect(title).toHaveClass('block text-center sm:pt-8 xs:pt-2.5');

    // and
    const orderButton = container.querySelector('[label="Order Now"]');
    expect(orderButton?.closest('div')).toHaveClass(
      'flex sm:pt-8 xs:pt-2.5 flex-row items-center space-x-4 justify-center',
    );

    const description = getByText('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
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

      await setupSpecTest(customProps);

      const customTitle = screen.getByText('Custom Title');
      const customDescription = screen.getByText('Custom Description');

      expect(customTitle).toBeTruthy();
      expect(customDescription).toBeTruthy();
    });
  });
});
