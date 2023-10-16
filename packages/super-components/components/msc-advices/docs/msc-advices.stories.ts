import { setupWorker } from 'msw';
import { localeList, defaultLocale } from '@ovhcloud/msc-utils';
import handlers from '../mock/handlers';

setupWorker(...handlers).start({
  onUnhandledRequest: 'bypass',
  quiet: true,
});

export default {
  title: 'Components/Manager Advices',
  tags: ['autodocs'],
  render: ({
    serviceName,
    serviceType,
    locale,
  }: {
    serviceType: string;
    locale: string;
    serviceName: string;
  }) => `
    <section>
      <msc-advices 
        locale="${locale}" 
        service-name="${serviceName}" 
        service-type="${serviceType}" 
      />
    </section>
  `,
  argTypes: {
    locale: {
      description: 'Locale of the labels',
      control: 'select',
      options: localeList,
      table: {
        defaultValue: { summary: defaultLocale },
      },
    },
    serviceType: {
      description: 'The type of the service',
      control: 'select',
      options: ['vps', 'domain-web'],
      default: 'vps',
    },
    serviceName: {
      description: 'The name of the service',
      control: 'select',
      options: ['abcd1234.fr', 'vps-abcd1234.vps.ovh.net'],
      default: 'vps-abcd1234.vps.ovh.net',
    },
  },
};

export const VPS = {
  args: {
    serviceType: 'vps',
    serviceName: 'vps-abcd1234.vps.ovh.net',
    locale: 'en-GB',
  },
};

export const Domain = {
  args: {
    serviceType: 'domain-web',
    serviceName: 'abcd1234.fr',
    locale: 'en-GB',
  },
};
