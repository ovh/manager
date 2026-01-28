import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Accordion, AccordionItem } from '@ovhcloud/ods-react';
import { CartItemDetails } from '../components';
import { TCartItemDetail } from '@/pages/instances/create/hooks/useCartItems';
import { TestCreateInstanceFormWrapper } from '@/__tests__/CreateInstanceFormWrapper';
import { TQuantityHintParams } from '@/pages/instances/create/view-models/cartViewModel';
import { ComponentProps } from 'react';

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
      <p data-testid={`cart-item-description-${nameText}`}>{descriptionText}</p>
    ),
    price,
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
});
