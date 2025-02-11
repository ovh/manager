import React from 'react';
import { Meta } from '@storybook/react';
import { ServiceDetails } from '@ovh-ux/manager-module-common-api';
import { BillingInformationsTileStandard } from './BillingInformationsTileStandard';
import { BillingInformationsDecorator } from '../BillingInformationsTile/utils';

export const BillingInformationsTileDefault = () => (
  <BillingInformationsTileStandard resourceName="my-resource-name" />
);

export const BillingInformationsTileLoading = () => (
  <BillingInformationsTileStandard resourceName="" />
);

export const StateItemServiceSuspended = () => (
  <BillingInformationsTileStandard resourceName="my-suspended-resource" />
);

export const StateItemServiceEngagedAndContinue = () => (
  <BillingInformationsTileStandard resourceName="resource-engaged-and-continue" />
);

export const StateItemServiceEngagedAndEnd = () => (
  <BillingInformationsTileStandard resourceName="resource-engaged-and-end" />
);

export const StateItemServiceManualRenew = () => (
  <BillingInformationsTileStandard resourceName="resource-manual-renew" />
);

const meta: Meta<
  React.ComponentProps<typeof BillingInformationsTileStandard> & {
    serviceDetails?: Partial<ServiceDetails>;
  }
> = {
  title: 'Dashboard/BillingInformationsTileStandard',
  component: BillingInformationsTileStandard,
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
