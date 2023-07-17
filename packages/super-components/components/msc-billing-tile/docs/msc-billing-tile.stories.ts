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
    offer: 'zpool-123456',
    language: 'en-GB',
  },
};

export const VPS = {
  args: {
    offer: 'vps-1234abcd.vps.ovh.net',
    ...defaultLabels,
  },
};

export const Domains = {
  args: {
    offer: 'agora3.ovh',
    ...defaultLabels,
  },
};
