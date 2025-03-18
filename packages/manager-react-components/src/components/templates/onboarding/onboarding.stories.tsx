import React from 'react';
import { Meta } from '@storybook/react';
import {
  OnboardingLayout,
  OnboardingLayoutProps,
} from './onboarding.component';
import { Card } from '../../navigation/card/card.component';
import placeholderSrc from './../../../../public/assets/placeholder.png';
import customImgSrc from './../../../../public/assets/error-banner-oops.png';
import { OdsText } from '@ovhcloud/ods-components/react';

export const OnboardingFullExample = () => (
  <OnboardingLayout
    title="Welcome Onboarding"
    orderHref="https://example.com/order"
    orderButtonLabel="Order Now"
    moreInfoHref="https://example.com/more-info"
    moreInfoButtonLabel="Learn More"
    img={{ src: placeholderSrc, style: { filter: 'grayscale(100%)' } }}
    description={
      <OdsText preset="paragraph" className="text-center">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </OdsText>
    }
    orderIam={{
      urn: 'urn:v1:eu:resource:vrackServices:vrs-bby-zkm-3a9-tlk',
      iamActions: ['vrackServices:apiovh:resource/edit'],
      displayTooltip: false,
    }}
  >
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
  </OnboardingLayout>
);

export const OnboardingDefault = () => (
  <OnboardingLayout title="Onboarding Default" />
);

export const OnboardingWithOrderCTA = () => (
  <OnboardingLayout
    title="Onboarding with order Button"
    orderHref="https://example.com/order"
    orderButtonLabel="Order Now"
  />
);

export const OnboardingWithIamCheckOnOrderCTA = () => (
  <OnboardingLayout
    title="Onboarding with IAM action check on order Button"
    orderHref="https://example.com/order"
    orderButtonLabel="Order Now"
    orderIam={{
      urn: 'urn:v1:eu:resource:vrackServices:vrs-bby-zkm-3a9-tlk',
      iamActions: ['vrackServices:apiovh:resource/edit'],
    }}
  />
);

export const OnboardingWithMoreInfoCTA = () => (
  <OnboardingLayout
    title="Onboarding with more info Button"
    moreInfoHref="https://example.com/more-info"
    moreInfoButtonLabel="Learn More"
  />
);

export const OnboardingWithImg = () => (
  <OnboardingLayout
    title="Onboarding with custom img"
    img={{ src: customImgSrc }}
  />
);

export const OnboardingWithDescription = () => (
  <OnboardingLayout
    title="Onboarding with Description"
    description={
      <OdsText preset="paragraph" className="text-center">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </OdsText>
    }
  />
);

export const OnboardingWithChildren = () => (
  <OnboardingLayout title="Onboarding with Children">
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
  </OnboardingLayout>
);

export const OnboardingWithoutHeadingSection = () => (
  <OnboardingLayout
    title="onboarding without heading section"
    hideHeadingSection
  >
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
  </OnboardingLayout>
);

const meta: Meta<typeof OnboardingLayout> = {
  title: 'Templates/Onboarding',
  component: OnboardingLayout,
};

export default meta;
