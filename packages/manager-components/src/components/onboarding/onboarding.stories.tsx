import React from 'react';
import { Meta } from '@storybook/react';
import {
  OnboardingLayout,
  OnboardingLayoutProps,
} from './onboarding.component';
import { Card } from '../card/card.component';

export const defaultProps: OnboardingLayoutProps = {
  title: 'Welcome to Onboarding',
  orderHref: 'https://example.com/order',
  orderButtonLabel: 'Order Now',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  moreInfoHref: 'https://example.com/more-info',
  img: {
    src: 'https://example.com/image',
  },
  moreInfoButtonLabel: 'Learn More',
  children: (
    <aside className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-12">
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
    </aside>
  ),
};

const meta: Meta<typeof OnboardingLayout> = {
  title: 'Components/Onboarding',
  decorators: [(story) => <div>{story()}</div>],
  component: OnboardingLayout,
  argTypes: {},
  args: defaultProps,
};

export default meta;
