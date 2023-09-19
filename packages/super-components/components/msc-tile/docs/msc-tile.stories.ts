import { localeList, defaultLocale } from '@ovhcloud/msc-utils';
import { createTile } from './create-tile';

const defaultLabels = {
  tileType: 'product',
  tileTitle: 'Titre du produit',
  tileDescription:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  href: 'https://ovh.com',
  imgSrc:
    'https://www.ovhcloud.com/sites/default/files/styles/offer_range_card/public/2021-06/1886_AI_Notebook1_Hero_600x400.png',
  imgAlt: 'offer',
  dataTracking: 'home::dashboard::test',
};

export default {
  title: 'Components/Manager Tile',
  tags: ['autodocs'],
  render: ({ tileNumber = 1, ...args }) => `
    <section style="display: grid; grid-gap: 30px; grid-template-columns: repeat(3, 1fr);">
      ${[...new Array(tileNumber)].map(() => createTile(args)).join('\n')}
    </section>
  `,
  argTypes: {
    tileNumber: {
      control: 'number',
      min: 1,
      default: 1,
      description: 'Number of tiles to display (only in the storybook)',
    },
    tileType: {
      description: 'Change the top label of the tile according to its type',
      control: 'select',
      options: ['product', 'faq'],
    },
    tileTitle: { control: 'text', description: 'Title of the tile' },
    tileDescription: {
      control: 'text',
      description: 'Description of the tile',
    },
    href: { control: 'text', description: 'URL of the tile and link' },
    isExternalHref: {
      control: 'boolean',
      description:
        'Change the icon of the link to indicate if the link is internal or external',
      table: {
        defaultValue: { summary: false },
      },
    },
    imgSrc: {
      control: 'text',
      description: 'URL of the image to display in the header of the tile',
    },
    imgAlt: { control: 'text', description: 'Alternative label of the image' },
    hasBadges: {
      control: 'boolean',
      description:
        'Display examples of badges in the story (in the actual code there is a badge slot)',
    },
    hasFooter: {
      control: 'boolean',
      description:
        'Display an example of footer containing a button in the tile (in the actual code there is a footer slot)',
    },
    locale: {
      description: 'Locale of the labels',
      control: 'select',
      options: localeList,
      table: {
        defaultValue: { summary: defaultLocale },
      },
    },
    dataTracking: {
      description: 'Tracking label sent when the tile or the link is clicked',
    },
  },
  args: {
    tileNumber: 1,
    tileType: 'faq',
    hasBadges: true,
    hasFooter: true,
    isExternalHref: false,
    locale: defaultLocale,
  },
};

export const FAQ = {
  args: {
    ...defaultLabels,
  },
};

export const Product = {
  args: {
    ...defaultLabels,
    hasBadges: true,
    hasFooter: true,
  },
};

export const WithBadges = {
  args: {
    ...defaultLabels,
    hasBadges: true,
  },
};

export const WithFooter = {
  args: {
    ...defaultLabels,
    hasFooter: true,
  },
};
