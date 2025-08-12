import { render } from '@testing-library/react';
import { LinkCard, LinkCardProps } from '..';

export const texts = {
  title: 'Titre du produit',
  category: 'NAS',
};

export const description =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

export const img = {
  alt: 'offer',
  src: 'https://www.ovhcloud.com/sites/default/files/styles/offer_range_card/public/2021-06/1886_AI_Notebook1_Hero_600x400.png',
};

export const href = 'https://ovh.com';

export const badges = [
  {
    text: 'Cloud computing',
  },
  {
    text: 'Beta',
  },
];

export const renderLinkCard = (props?: LinkCardProps) =>
  render(<LinkCard {...props} />);
