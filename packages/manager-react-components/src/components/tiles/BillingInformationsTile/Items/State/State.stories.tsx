import React from 'react';
import { Meta } from '@storybook/react';
import { ServiceDetails } from '@ovh-ux/manager-module-common-api';
import { BillingInformationsDecorator } from '../../utils';
import { BillingInformationsState } from './State';
import { BillingInformationsTile } from '../../BillingInformationsTile';

export const StateItem = () => (
  <BillingInformationsTile resourceName="my-resource-name">
    <BillingInformationsState />
  </BillingInformationsTile>
);

export const StateItemLoading = () => (
  <BillingInformationsTile resourceName="">
    <BillingInformationsState />
  </BillingInformationsTile>
);

export const StateItemServiceSuspended = () => (
  <BillingInformationsTile resourceName="my-suspended-resource">
    <BillingInformationsState />
  </BillingInformationsTile>
);

export const StateItemServiceEngagedAndContinue = () => (
  <BillingInformationsTile resourceName="resource-engaged-and-continue">
    <BillingInformationsState />
  </BillingInformationsTile>
);

export const StateItemServiceEngagedAndEnd = () => (
  <BillingInformationsTile resourceName="resource-engaged-and-end">
    <BillingInformationsState />
  </BillingInformationsTile>
);

export const StateItemServiceManualRenew = () => (
  <BillingInformationsTile resourceName="resource-manual-renew">
    <BillingInformationsState />
  </BillingInformationsTile>
);

const meta: Meta<
  React.ComponentProps<typeof BillingInformationsTile> & {
    serviceDetails?: Partial<ServiceDetails>;
  }
> = {
  title: 'Dashboard/BillingInformationsTile/State',
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
    resourceName: '',
  },
  decorators: [BillingInformationsDecorator],
};

export default meta;
