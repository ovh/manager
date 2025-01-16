import React, { useState } from 'react';
import { apiClient } from '@ovh-ux/manager-core-api';
import AxiosMockAdapter from 'axios-mock-adapter';
import { Meta } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { defaultServiceResponse } from '@ovh-ux/manager-module-common-api';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { BillingInformationsTile } from './BillingInformationsTile';

export const BillingInformationsTileWithContact = () => (
  <BillingInformationsTile resourceName="my-resource-name">
    <BillingInformationsTile.Title>Subscription</BillingInformationsTile.Title>
    <BillingInformationsTile.Divider />
    <BillingInformationsTile.CreationDate />
    <BillingInformationsTile.Divider />
    <BillingInformationsTile.State />
    <BillingInformationsTile.Divider />
    <BillingInformationsTile.Contacts />
  </BillingInformationsTile>
);

export const BillingInformationsTileLoading = () => (
  <BillingInformationsTile resourceName="" />
);

export const BillingInformationsTileWithContactLoading = () => (
  <BillingInformationsTile resourceName="">
    <BillingInformationsTile.Title>Subscription</BillingInformationsTile.Title>
    <BillingInformationsTile.Divider />
    <BillingInformationsTile.CreationDate />
    <BillingInformationsTile.Divider />
    <BillingInformationsTile.State />
    <BillingInformationsTile.Divider />
    <BillingInformationsTile.Contacts />
  </BillingInformationsTile>
);

const meta: Meta<typeof BillingInformationsTile> = {
  title: 'Dashboard/BillingInformationsTile',
  component: BillingInformationsTile,
  argTypes: {},
  args: {
    resourceName: '',
  },
  decorators: [
    // eslint-disable-next-line @typescript-eslint/naming-convention
    (Story) => {
      const [queryClient] = useState(new QueryClient());
      const mock = new AxiosMockAdapter(apiClient.v6);

      // Mock des requêtes Axios
      mock.onGet('/services?resourceName=my-resource-name').reply(200, ['01']);

      // Mock des requêtes Axios
      mock.onGet('/services/01').reply(200, { ...defaultServiceResponse });

      return (
        <ShellContext.Provider
          value={
            {
              shell: { navigation: { getURL: async () => '' } },
            } as unknown as ShellContextType
          }
        >
          <QueryClientProvider client={queryClient}>
            <Story />
          </QueryClientProvider>
        </ShellContext.Provider>
      );
    },
  ],
};

export default meta;
