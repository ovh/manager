import { createBillingTile } from './create-billing-tile';

const defaultLabels = {
  dataTracking: 'home::dashboard::test',
};

export default {
  title: 'Components/Manager Billing Tile',
  tags: ['autodocs'],
  render: ({ tileNumber = 1, ...args }) => `
    <section style="display: grid; grid-gap: 30px; grid-template-columns: repeat(3, 1fr);">
      ${[...new Array(tileNumber)]
        .map(() => createBillingTile(args))
        .join('\n')}
    </section>
  `,
  argTypes: {
    language: { control: 'text', default: 'fr-FR' },
  },
};

export const NASHA = {
  args: {
    ...defaultLabels,
    servicePath: 'dedicated/nasha/zpool-128894',
    offer: 'zpool-128894',
    language: 'en-GB',
  },
};

export const VPS = {
  args: {
    servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
    offer: 'vps-1234abcd.vps.ovh.net',
    ...defaultLabels,
  },
};

export const Domains = {
  args: {
    servicePath: 'domain/agora3.ovh',
    offer: 'agora3.ovh',
    ...defaultLabels,
  },
};
