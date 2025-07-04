import React from 'react';
import { waitFor } from '@testing-library/react';
import { Card, CardProps } from './card.component';
import { render } from '../../../utils/test.provider';

export const defaultProps: CardProps = {
  texts: {
    title: 'Titre du produit',
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    category: 'NAS',
  },
  href: 'https://ovh.com',
  img: {
    alt: 'offer',
    src: 'https://www.ovhcloud.com/sites/default/files/styles/offer_range_card/public/2021-06/1886_AI_Notebook1_Hero_600x400.png',
  },
};

const setupSpecTest = async (customProps?: Partial<CardProps>) =>
  waitFor(() => render(<Card {...defaultProps} {...customProps} />));

describe('specs:Card', () => {
  it('renders without error', async () => {
    const screen = await setupSpecTest();
    const title = screen.getByText('Titre du produit');
    expect(title).not.toBeNull();
  });

  describe('contents', () => {
    it('should have a badges if provided', async () => {
      const { container } = await setupSpecTest({
        badges: [{ text: 'Beta' }],
      });
      waitFor(() => {
        expect(
          container.querySelector('.card-badges-section .ods-badge'),
        ).toBeInTheDocument();
      });
    });

    it('should have design system correctly set for texts', async () => {
      const cardProps: Partial<CardProps> = {
        texts: {
          title: 'my title',
          description: 'my decription',
          category: 'my category',
        },
      };

      const { getByText, container } = await setupSpecTest(cardProps);
      const titleElement = getByText(cardProps.texts.title);
      expect(titleElement).toBeVisible();

      const descElement = getByText(cardProps.texts.description);
      expect(descElement).toBeVisible();

      const catElement = getByText(cardProps.texts.category);
      expect(catElement).toBeVisible();

      expect(container.querySelector('[label="En savoir plus"]')).toBeDefined();
    });

    it('should override href label', async () => {
      const cardProps: Partial<CardProps> = {
        texts: {
          title: 'my title',
          description: 'my decription',
          category: 'my category',
        },
        hrefLabel: 'custom label',
      };

      const { container } = await setupSpecTest(cardProps);
      expect(container.querySelector('[label="custom label"]')).toBeDefined();
    });
  });
});
