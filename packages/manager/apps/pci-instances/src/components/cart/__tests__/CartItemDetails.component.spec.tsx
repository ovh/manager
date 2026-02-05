import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { Accordion, AccordionItem } from '@ovhcloud/ods-react';
import { CartItemDetails } from '../components';
import { TCartItemDetail } from '@/pages/instances/create/hooks/useCartItems';
import { TestCreateInstanceFormWrapper } from '@/__tests__/CreateInstanceFormWrapper';
import { TQuantityHintParams } from '@/pages/instances/create/view-models/cartViewModel';
import { ComponentProps } from 'react';

const getTextPriceMock = (price: number) => `${(price / 100).toFixed(4)} €`;

vi.mock('@ovh-ux/muk', () => ({
  useCatalogPrice: () => ({
    getTextPrice: vi.fn().mockImplementation(getTextPriceMock),
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
    priceUnit: 'HT/heure',
  },
  {
    id: 'network',
    nameText: networkName,
    descriptionText: networkDescriptionName,
    price: null,
  },
];

const details: TCartItemDetail[] = detailsData.map(
  ({ id, nameText, descriptionText, price, priceUnit }) => ({
    id,
    name: nameText,
    description: (
      <p data-testid={`cart-item-description-${nameText}`}>{descriptionText}</p>
    ),
    price,
    priceUnit,
  }),
);

type TCartItemDetailsProps = ComponentProps<typeof CartItemDetails>;

const renderCartItemDetails = (props: Partial<TCartItemDetailsProps> = {}) =>
  render(
    <TestCreateInstanceFormWrapper>
      <Accordion value={['cart-item']}>
        <AccordionItem value="cart-item">
          <CartItemDetails details={details} {...props} />
        </AccordionItem>
      </Accordion>
    </TestCreateInstanceFormWrapper>,
  );

describe('Considering CartItemDetails component', () => {
  test('Should return expected details', () => {
    renderCartItemDetails();

    const imageDetails = screen.getByTestId(`cart-item-details-${imageName}`);
    expect(imageDetails).toHaveTextContent(imageName);
    expect(imageDetails).toHaveTextContent(imageDescriptionName);
    expect(imageDetails).toHaveTextContent(
      `${getTextPriceMock(imagePrice)} HT/heure`,
    );

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

  test('Should use default quota of 1 when quantityHintParams is not provided', () => {
    renderCartItemDetails();

    const quantitySelector = screen.getByRole('spinbutton', { hidden: true });
    expect(quantitySelector).toBeInTheDocument();
    expect(quantitySelector).toHaveAttribute('aria-valuemax', '1');
  });

  test('Should use provided quota from quantityHintParams', () => {
    const quantityHintParams: TQuantityHintParams = {
      quota: 10,
      type: 'test-type',
      region: 'test-region',
      regionId: 'test-region-id',
    };

    renderCartItemDetails({ quantityHintParams });

    const quantitySelector = screen.getByRole('spinbutton', { hidden: true });
    expect(quantitySelector).toBeInTheDocument();
    expect(quantitySelector).toHaveAttribute('aria-valuemax', '10');
  });

  test('Should display ~ prefix when price is approximate', () => {
    const approximateDetails: TCartItemDetail[] = [
      {
        id: 'approx',
        name: 'Approximate item',
        description: <span>Description</span>,
        price: 1000,
        priceUnit: 'HT/heure',
        isApproximate: true,
      },
    ];

    renderCartItemDetails({ details: approximateDetails });

    const priceElement = screen.getByTestId('cart-item-details-price');
    expect(priceElement).toHaveTextContent(
      `~${getTextPriceMock(1000)} HT/heure`,
    );
  });
});
