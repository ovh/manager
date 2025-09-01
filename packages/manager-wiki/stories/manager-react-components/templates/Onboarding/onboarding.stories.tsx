import React from 'react';
import { Meta } from '@storybook/react';
import { LinkCard, OnboardingLayout } from '@ovh-ux/manager-react-components';
import placeholderSrc from '@ovh-ux/manager-react-components/public/assets/placeholder.png';
import customImgSrc from '@ovh-ux/manager-react-components/public/assets/error-banner-oops.png';
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
      <LinkCard
        href={''}
        texts={{
          title: 'Test Onboarding 1',
          description: 'This is the description 1',
          category: 'WEB',
        }}
      />
      <LinkCard
        href={''}
        texts={{
          title: 'Test Onboarding 2',
          description: 'This is the description 2',
          category: 'CLOUD',
        }}
      />
      <LinkCard
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
      <LinkCard
        href={''}
        texts={{
          title: 'Test Onboarding 1',
          description: 'This is the description 1',
          category: 'WEB',
        }}
      />
      <LinkCard
        href={''}
        texts={{
          title: 'Test Onboarding 2',
          description: 'This is the description 2',
          category: 'CLOUD',
        }}
      />
      <LinkCard
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
      <LinkCard
        href={''}
        texts={{
          title: 'Test Onboarding 1',
          description: 'This is the description 1',
          category: 'WEB',
        }}
      />
      <LinkCard
        href={''}
        texts={{
          title: 'Test Onboarding 2',
          description: 'This is the description 2',
          category: 'CLOUD',
        }}
      />
      <LinkCard
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
  title: 'Manager React Components/Components/OnboardingLayout',
  component: OnboardingLayout,
  argTypes: {
    title: {
      description: 'The main title of the onboarding layout',
      control: 'text',
      type: { required: true },
    },
    description: {
      description:
        'Rich text content displayed below the title. Can be a string or React node.',
      control: 'text',
    },
    hideHeadingSection: {
      description:
        'When true, hides the entire heading section (title, description, buttons)',
      control: 'boolean',
      defaultValue: false,
    },
    orderButtonLabel: {
      description: 'Label text for the order button',
      control: 'text',
    },
    orderHref: {
      description:
        'URL to navigate to when order button is clicked. Opens in a new tab.',
      control: 'text',
    },
    onOrderButtonClick: {
      description: 'Callback function triggered when order button is clicked',
      action: 'clicked',
    },
    isActionDisabled: {
      description: 'Disables the order button when true',
      control: 'boolean',
      defaultValue: false,
    },
    orderIam: {
      description: 'IAM configuration for the order button',
      control: 'object',
      table: {
        type: {
          summary:
            '{ urn: string; iamActions: string[]; displayTooltip?: boolean }',
        },
      },
    },
    moreInfoHref: {
      description: 'URL for the "More Info" button. Opens in a new tab.',
      control: 'text',
    },
    moreInfoButtonLabel: {
      description: 'Label text for the "More Info" button',
      control: 'text',
    },
    moreInfoButtonIcon: {
      description: 'Icon to display on the "More Info" button',
      control: 'select',
      options: ['externalLink', 'info', 'help'],
      defaultValue: 'externalLink',
    },
    onMoreInfoButtonClick: {
      description:
        'Callback function triggered when "More Info" button is clicked',
      action: 'clicked',
    },
    isMoreInfoButtonDisabled: {
      description: 'Disables the "More Info" button when true',
      control: 'boolean',
      defaultValue: false,
    },
    img: {
      description:
        'Image configuration for the header. Extends standard img props.',
      control: 'object',
      table: {
        type: {
          summary: 'React.ComponentProps<"img">',
        },
      },
    },
    children: {
      description: 'Child components to display below the header section',
      control: false,
    },
  },
};

export default meta;
