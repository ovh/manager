import React from 'react';
import { Meta } from '@storybook/react';
import { ServiceDetails } from '@ovh-ux/manager-module-common-api';
import { BillingInformationsDecorator } from '../../utils';
import { BillingInformationsTile } from '../../BillingInformationsTile';
import { BillingInformationsNextBilling } from './NextBillingDate';

export const NextBillingDateItem = () => (
  <BillingInformationsTile resourceName="my-resource-name">
    <BillingInformationsNextBilling />
  </BillingInformationsTile>
);

export const NextBillingDateItemLoading = () => (
  <BillingInformationsTile resourceName="">
    <BillingInformationsNextBilling />
  </BillingInformationsTile>
);

const meta: Meta<
  React.ComponentProps<typeof BillingInformationsTile> & {
    serviceDetails?: Partial<ServiceDetails>;
  }
> = {
  title: 'Dashboard/BillingInformationsTile/NextBillingDate',
  component: BillingInformationsTile,
  argTypes: {
    resourceName: {
      type: 'string',
      description: 'resource name of service',
      options: [
        'None',
        'my-resource-name',
        'my-suspended-resource',
        'resource-engaged-and-end',
        'resource-engaged-and-continue',
        'resource-manual-renew',
      ],
      control: { type: 'radio' },
    },
    serviceDetails: {
      control: { type: 'object' },
      description:
        'Not prod properties. Only mock returned by API on the `/services/{serviceId}` request for storybook',
    },
  },
  args: {
    resourceName: 'my-resource-name',
  },
  decorators: [BillingInformationsDecorator],
};

export default meta;
