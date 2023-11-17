import { setupWorker } from 'msw';
import { localeList, defaultLocale } from '@ovhcloud/msc-utils';

import handlers from '../mock/handlers';

setupWorker(...handlers).start({ onUnhandledRequest: 'bypass', quiet: true });

export default {
  title: 'Components/Manager Network Tile',
  tags: ['autodocs'],
  render: ({
    tileNumber = 1,
    locale,
    serviceName,
  }: {
    tileNumber: number;
    locale: string;
    serviceName: string;
  }) => `
    <section>
      ${[...new Array(tileNumber)]
        .map(
          () => `
            <msc-network-tile
              locale="${locale}"
              service-name="${serviceName}"
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
    serviceName: {
      description: 'API route of the service',
      control: 'select',
      options: ['ns111111.ovh.net', 'ns222222.ovh.net'],
      default: 'ns111111.ovh.net',
    },
  },
};

export const dedicatedExempleFr = {
  args: {
    serviceName: 'ns111111.ovh.net',
    locale: 'fr-FR',
  },
};
