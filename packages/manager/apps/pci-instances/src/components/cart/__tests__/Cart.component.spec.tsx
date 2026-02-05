import { render, screen } from '@testing-library/react';
import { Button, Text } from '@ovhcloud/ods-react';
import { describe, vi, expect, test } from 'vitest';
import { Cart } from '../Cart.component';
import { t } from 'i18next';
import { TestCreateInstanceFormWrapper } from '@/__tests__/CreateInstanceFormWrapper';
import { BILLING_TYPE } from '@/types/instance/common.type';

const instanceDetails = [
  {
    id: 'localization',
    name: 'instance localization',
    description: (
      <Text preset="heading-6" className="text-[--ods-color-heading]">
        eu-west-par
      </Text>
    ),
    price: 50,
  },
  {
    id: 'image',
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
    id: 'localization',
    name: 'kube localization',
    description: (
      <Text preset="heading-6" className="text-[--ods-color-heading]">
        DE
      </Text>
    ),
    price: null,
  },
  {
    id: 'plan',
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

const handleCreateInstance = vi.fn();

const ActionButtons = (
  <>
    <Button onClick={handleCreateInstance}>
      {t('creation:pci_instance_creation_create_my_instance')}
    </Button>
    <Button variant="outline">
      {t('creation:pci_instance_creation_configuration_code')}
    </Button>
  </>
);

afterEach(() => {
  vi.clearAllMocks();
});

describe('Considering the Cart component', () => {
  test('Should render correct cart items expanded states', () => {
    render(
      <TestCreateInstanceFormWrapper>
        <Cart
          items={cartItems}
          actionsButtons={ActionButtons}
          billingType={BILLING_TYPE.Hourly}
        />
      </TestCreateInstanceFormWrapper>,
    );

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
    render(
      <TestCreateInstanceFormWrapper>
        <Cart
          items={cartItems}
          actionsButtons={ActionButtons}
          billingType={BILLING_TYPE.Hourly}
        />
      </TestCreateInstanceFormWrapper>,
    );

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

  test.skip('Should render expected total price', () => {
    render(
      <TestCreateInstanceFormWrapper>
        <Cart
          items={cartItems}
          actionsButtons={ActionButtons}
          billingType={BILLING_TYPE.Hourly}
        />
      </TestCreateInstanceFormWrapper>,
    );

    const price = screen.getByTestId('cart-total-price');
    expect(price).toHaveTextContent('90');
  });
});
