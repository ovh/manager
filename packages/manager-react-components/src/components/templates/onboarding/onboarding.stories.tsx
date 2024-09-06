import React from 'react';
import { Meta } from '@storybook/react';
import {
  OnboardingLayout,
  OnboardingLayoutProps,
} from './onboarding.component';
import { Card } from '../../navigation/card/card.component';
import placeholderSrc from './assets/placeholder.png';

export const defaultProps: OnboardingLayoutProps = {
  title: 'Welcome to Onboarding',
  orderHref: 'https://example.com/order',
  orderButtonLabel: 'Order Now',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  moreInfoHref: 'https://example.com/more-info',
  img: {
    src: placeholderSrc,
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

const meta: Meta<typeof OnboardingLayout> = {
  title: 'Templates/Onboarding',
  decorators: [(story) => <div>{story()}</div>],
  component: OnboardingLayout,
  argTypes: {},
  args: defaultProps,
};

export default meta;
