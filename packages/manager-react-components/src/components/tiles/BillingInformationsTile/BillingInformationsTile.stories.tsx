import React from 'react';
import { Meta } from '@storybook/react';
import { BillingInformationsTile } from './BillingInformationsTile';
import { BillingInformationsDecorator } from './utils';

export const BillingInformationsTileDefault = () => (
  <BillingInformationsTile resourceName="my-resource-name">
    <BillingInformationsTile.Title>Subscription</BillingInformationsTile.Title>
    <BillingInformationsTile.Divider />
    <BillingInformationsTile.CreationDate />
    <BillingInformationsTile.Divider />
    <BillingInformationsTile.State />
    <BillingInformationsTile.Divider />
    <BillingInformationsTile.NextBillingDate />
    <BillingInformationsTile.Divider />
    <BillingInformationsTile.ResiliateLink />
  </BillingInformationsTile>
);

export const BillingInformationsTileLoading = () => (
  <BillingInformationsTile resourceName="">
    <BillingInformationsTile.Title>Subscription</BillingInformationsTile.Title>
    <BillingInformationsTile.Divider />
    <BillingInformationsTile.CreationDate />
    <BillingInformationsTile.Divider />
    <BillingInformationsTile.State />
    <BillingInformationsTile.Divider />
    <BillingInformationsTile.NextBillingDate />
    <BillingInformationsTile.Divider />
    <BillingInformationsTile.ResiliateLink />
  </BillingInformationsTile>
);

const meta: Meta<typeof BillingInformationsTile> = {
  title: 'Dashboard/BillingInformationsTile',
  component: BillingInformationsTile,
  argTypes: {},
  args: {
    resourceName: '',
  },
  decorators: [BillingInformationsDecorator],
};

export default meta;
