import { setupWorker } from 'msw';
import { localeList, defaultLocale } from '@ovhcloud/msc-utils';
import handlers from '../mock/handlers';

setupWorker(...handlers).start({
  onUnhandledRequest: 'bypass',
  quiet: true,
});

export default {
  title: 'Components/Manager Billing Tile',
  tags: ['autodocs'],
  render: ({
    tileNumber = 1,
    locale,
    servicePath,
  }: {
    tileNumber: number;
    locale: string;
    servicePath: string;
  }) => `
    <section style="display: grid; grid-gap: 30px; grid-template-columns: repeat(3, 1fr);">
      ${[...new Array(tileNumber)]
        .map(
          () =>
            `<msc-billing-tile
              locale="${locale}"
              service-path="${servicePath}"
            />`,
        )
        .join('\n')}
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
    servicePath: {
      description: 'API route of the service',
      control: 'select',
      options: [
        'vps/vps-00000000.vps.ovh.net',
        'dedicated/nasha/zpool-111111',
        'domain/domain-test.ovh',
        'vps/vps-33333333.vps.ovh.net',
        'vps/vps-99999999.vps.ovh.net',
        'emails/domain/domain-test.ovh',
        'hosting/web/abcdef.test.hosting.ovh.net',
      ],
      default: 'vps/vps-00000000.vps.ovh.net',
    },
  },
  args: {
    servicePath: 'vps/vps-00000000.vps.ovh.net',
    locale: defaultLocale,
  },
};

export const VPS = {
  args: {
    servicePath: 'vps/vps-00000000.vps.ovh.net',
    locale: 'en-GB',
  },
};

export const Domain = {
  args: {
    servicePath: 'domain/domain-test.ovh',
    locale: 'en-GB',
  },
};

export const Emails = {
  args: {
    servicePath: 'emails/domain/domain-test.ovh',
    locale: 'fr-FR',
  },
};
