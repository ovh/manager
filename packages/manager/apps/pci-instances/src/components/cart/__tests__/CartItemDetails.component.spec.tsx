import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { Accordion, AccordionItem } from '@ovhcloud/ods-react';
import { CartItemDetails } from '../components';
import { TCartItemDetail } from '@/pages/instances/create/hooks/useCartItems';

vi.mock('@ovh-ux/muk', () => ({
  useCatalogPrice: () => ({
    getTextPrice: (price: number) => `${(price / 100).toFixed(4)} €`,
  }),
}));

const imageName = 'image';
const imageDescriptionName = 'Linux';
const imagePrice = 5000; // 50.00 €

const networkName = 'network';
const networkDescriptionName = 'ovh';

const detailsData = [
  {
    id: 'image',
    nameText: imageName,
    descriptionText: imageDescriptionName,
    price: imagePrice,
    displayPrice: true,
    priceUnit: 'HT/heure',
  },
  {
    id: 'network',
    nameText: networkName,
    descriptionText: networkDescriptionName,
    displayPrice: false,
  },
];

const details: TCartItemDetail[] = detailsData.map(
  ({ id, nameText, descriptionText, price, displayPrice, priceUnit }) => ({
    id,
    name: nameText,
    description: (
      <p data-testid={`cart-item-description-${nameText}`}>{descriptionText}</p>
    ),
    displayPrice,
    price,
    priceUnit,
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

    const imageDetails = screen.getByTestId(`cart-item-details-${imageName}`);
    expect(imageDetails).toHaveTextContent(imageName);
    expect(imageDetails).toHaveTextContent(imageDescriptionName);
    expect(imageDetails).toHaveTextContent('50.0000 €');
    expect(imageDetails).toHaveTextContent('HT/heure');

    const networkDetails = screen.getByTestId(
      `cart-item-details-${networkName}`,
    );
    expect(networkDetails).toHaveTextContent(networkName);
    expect(networkDetails).toHaveTextContent(networkDescriptionName);
    const priceElements = screen.getAllByTestId('cart-item-details-price');
    expect(priceElements).toHaveLength(1);

    const carItemDividerElements = screen.getAllByTestId(
      'cart-item-details-divider',
    );
    expect(carItemDividerElements).toHaveLength(details.length - 1);
  });

  test('Should display price only when displayPrice is true', () => {
    const detailsWithPrice: TCartItemDetail[] = [
      {
        id: 'flavor',
        name: 'Flavor',
        description: <p>B3-8</p>,
        displayPrice: true,
        price: 10000,
        priceUnit: 'HT/mois',
      },
    ];

    render(
      <Accordion>
        <AccordionItem value="">
          <CartItemDetails details={detailsWithPrice} />
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByTestId('cart-item-details-price')).toHaveTextContent(
      '100.0000 €',
    );
    expect(screen.getByText('HT/mois')).toBeInTheDocument();
  });

  test('Should not display price when displayPrice is false', () => {
    const detailsWithoutPrice: TCartItemDetail[] = [
      {
        id: 'backup',
        name: 'Backup',
        description: <p>Custom backup display</p>,
        displayPrice: false,
        price: 5000,
      },
    ];

    render(
      <Accordion>
        <AccordionItem value="">
          <CartItemDetails details={detailsWithoutPrice} />
        </AccordionItem>
      </Accordion>,
    );

    expect(
      screen.queryByTestId('cart-item-details-price'),
    ).not.toBeInTheDocument();
  });
});
