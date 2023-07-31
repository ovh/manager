import { createTile } from './create-tile';

const defaultLabels = {
  tileType: 'Catégorie',
  tileTitle: 'Titre du produit',
  tileDescription:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  href: 'https://ovh.com',
  imgSrc:
    'https://www.ovhcloud.com/sites/default/files/styles/offer_range_card/public/2021-06/1886_AI_Notebook1_Hero_600x400.png',
  imgAlt: 'offer',
  seeMoreLabel: 'En savoir plus',
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
    tileNumber: { control: 'number', default: 1 },
    tileType: { control: 'text' },
    tileTitle: { control: 'text' },
    tileDescription: { control: 'text' },
    href: { control: 'text' },
    isExternalHref: { control: 'boolean' },
    seeMoreLabel: { control: 'text' },
    imgSrc: { control: 'text' },
    imgAlt: { control: 'text' },
    hasBadges: { control: 'boolean' },
    hasFooter: { control: 'boolean' },
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
