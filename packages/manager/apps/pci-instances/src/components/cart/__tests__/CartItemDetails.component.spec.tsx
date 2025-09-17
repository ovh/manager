import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Accordion, AccordionItem } from '@ovhcloud/ods-react';
import { TCartItemDetail } from '../Cart.component';
import { CartItemDetails } from '../components';

const imageName = 'image';
const imageDescriptionName = 'Linux';
const imagePrice = 50;

const networkName = 'network';
const networkDescriptionName = 'ovh';
const networkPrice = 70;

const detailsData = [
  {
    nameText: imageName,
    descriptionText: imageDescriptionName,
    price: imagePrice,
  },
  {
    nameText: networkName,
    descriptionText: networkDescriptionName,
    price: networkPrice,
  },
];

const details: TCartItemDetail[] = detailsData.map(
  ({ nameText, descriptionText, price }) => ({
    name: nameText,
    description: (
      <p data-testid={`cart-item-description-${imageName}`}>
        {descriptionText}
      </p>
    ),
    price,
  }),
);

describe('Considering CartItemDetails component', () => {
  test('Should return expected details', () => {
    render(
      <Accordion>
        <AccordionItem value="">
          <CartItemDetails details={details} />
        </AccordionItem>
      </Accordion>,
    );

    detailsData.forEach(({ nameText, descriptionText, price }) => {
      const carItemDetails = screen.getByTestId(
        `cart-item-details-${nameText}`,
      );
      expect(carItemDetails).toHaveTextContent(nameText);
      expect(carItemDetails).toHaveTextContent(descriptionText);
      expect(carItemDetails).toHaveTextContent(`${price}`);
    });

    const carItemDividerElements = screen.getAllByTestId(
      'cart-item-details-divider',
    );
    expect(carItemDividerElements).toHaveLength(details.length - 1);
  });
});
