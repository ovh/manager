import { render, screen } from '@testing-library/react';
import { Text } from '@ovhcloud/ods-react';
import { describe, vi, expect, test } from 'vitest';
import { Cart, TCartItem } from '../Cart.component';

const instanceDetails = [
  {
    name: 'instance localization',
    description: (
      <Text preset="heading-6" className="text-[--ods-color-heading]">
        eu-west-par
      </Text>
    ),
    price: 50,
  },
  {
    name: 'image',
    description: (
      <Text preset="heading-6" className="text-[--ods-color-heading]">
        Linux
      </Text>
    ),
    price: 10,
  },
];

const kubeDetails = [
  {
    name: 'kube localization',
    description: (
      <Text preset="heading-6" className="text-[--ods-color-heading]">
        DE
      </Text>
    ),
  },
  {
    name: 'plan',
    description: (
      <Text preset="heading-6" className="text-[--ods-color-heading]">
        free
      </Text>
    ),
    price: 30,
  },
];

const cartItems = [
  {
    id: '0',
    title: 'instance',
    name: 'b3_8_28_17_01',
    details: instanceDetails,
    expanded: true,
  },
  {
    id: '1',
    title: 'kubernetes',
    name: 'cluster_01_02_03',
    details: kubeDetails,
    expanded: false,
  },
];

vi.mock('@ovh-ux/manager-react-components', () => ({
  useCatalogPrice: vi.fn().mockReturnValue({
    getTextPrice: vi.fn((price: number) => `${price}`),
    getFormattedHourlyCatalogPrice: vi.fn(),
    getFormattedMonthlyCatalogPrice: vi.fn(),
  }),
}));

const renderCart = (items: TCartItem[]) => render(<Cart items={items} />);

afterEach(() => {
  vi.clearAllMocks();
});

describe('Considering the Cart component', () => {
  test('Should render correct cart items expanded states', () => {
    renderCart(cartItems);

    const instancelocalizationElt = screen.getByTestId(
      `cart-item-details-instance localization`,
    );
    expect(instancelocalizationElt).toBeVisible();

    const kubelocalizationElt = screen.getByTestId(
      `cart-item-details-kube localization`,
    );
    expect(kubelocalizationElt).not.toBeVisible();
  });

  test('Should render correct cart items details', () => {
    renderCart(cartItems);

    const instanceLocalizationElt = screen.getByTestId(
      `cart-item-details-instance localization`,
    );
    expect(instanceLocalizationElt).toHaveTextContent('eu-west-par');
    expect(instanceLocalizationElt).toHaveTextContent('50');

    const instanceImageElt = screen.getByTestId(`cart-item-details-image`);
    expect(instanceImageElt).toHaveTextContent('Linux');
    expect(instanceImageElt).toHaveTextContent('10');

    const kubeElt = screen.getByTestId(`cart-item-details-kube localization`);
    expect(kubeElt).not.toBeVisible();
  });

  test('Should render expected total price', () => {
    renderCart(cartItems);

    const price = screen.getByTestId('cart-total-price');
    expect(price).toHaveTextContent('90');
  });
});
