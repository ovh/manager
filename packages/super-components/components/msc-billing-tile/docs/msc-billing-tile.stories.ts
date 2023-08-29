import { setupWorker, rest } from 'msw';
import tradFR from '../src/translations/Messages_fr_FR.json';
import tradEN from '../src/translations/Messages_en_GB.json';
import handlers from '../mock/handlers';

setupWorker(
  ...handlers,
  rest.get('/translations/Messages_fr_FR.json', (_, res, ctx) =>
    res(ctx.json(tradFR), ctx.status(200)),
  ),
  rest.get('/translations/Messages_en_GB.json', (_, res, ctx) =>
    res(ctx.json(tradEN), ctx.status(200)),
  ),
).start({ onUnhandledRequest: 'bypass', quiet: true });

export default {
  title: 'Components/Manager Billing Tile',
  tags: ['autodocs'],
  render: ({
    tileNumber = 1,
    language,
    servicePath,
  }: {
    tileNumber: number;
    language: string;
    servicePath: string;
  }) => `
    <section style="display: grid; grid-gap: 30px; grid-template-columns: repeat(3, 1fr);">
      ${[...new Array(tileNumber)]
        .map(
          () =>
            `<msc-billing-tile
              language="${language}"
              service-path="${servicePath}"
            />`,
        )
        .join('\n')}
    </section>
  `,
  argTypes: {
    language: {
      control: 'select',
      options: ['fr-FR', 'en-GB'],
      default: 'fr-FR',
    },
    servicePath: {
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
};

export const VPS = {
  args: {
    servicePath: 'vps/vps-00000000.vps.ovh.net',
    language: 'en-GB',
  },
};

export const Domain = {
  args: {
    servicePath: 'domain/domain-test.ovh',
    language: 'en-GB',
  },
};

export const Emails = {
  args: {
    servicePath: 'emails/domain/domain-test.ovh',
    language: 'fr-FR',
  },
};
