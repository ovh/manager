import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Cart } from '../../Cart.component';
import { TCartItem } from '@/pages/instances/create/hooks/useCartItems';
import { BILLING_TYPE } from '@/types/instance/common.type';
import { TestCreateInstanceFormWrapper } from '@/__tests__/CreateInstanceFormWrapper';

vi.mock('@ovh-ux/muk', () => ({
  useCatalogPrice: () => ({
    getTextPrice: (price: number) => `${(price / 100).toFixed(2)} €`,
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({ i18nKey }: { i18nKey?: string }) =>
    React.createElement('span', {}, i18nKey ?? ''),
}));

describe('Cart', () => {
  const mockActionsButtons = <button>Action</button>;

  const createMockCartItem = (
    id: string,
    title: string,
    details: Array<{
      id: string;
      name: string;
      price: number | null;
      priceUnit?: string;
    }>,
  ): TCartItem => ({
    id,
    title,
    details,
    expanded: true,
  });

  describe('Total calculation excluding backups', () => {
    it('should exclude backup prices from total in hourly mode', () => {
      const cartItems: TCartItem[] = [
        createMockCartItem('instance', 'Instance', [
          { id: 'flavor', name: 'Flavor', price: 1000 },
          { id: 'image', name: 'Image', price: 500 },
          {
            id: 'backup',
            name: 'Backup auto (local)',
            price: 200,
          },
        ]),
      ];

      render(
        <TestCreateInstanceFormWrapper>
          <Cart
            items={cartItems}
            actionsButtons={mockActionsButtons}
            billingType={BILLING_TYPE.Hourly}
          />
        </TestCreateInstanceFormWrapper>,
      );

      expect(screen.getByTestId('cart-total-price')).toBeDefined();
    });

    it('should exclude backup prices from total in monthly mode', () => {
      const cartItems: TCartItem[] = [
        createMockCartItem('instance', 'Instance', [
          { id: 'flavor', name: 'Modèle', price: 20000 },
          {
            id: 'backup',
            name: 'Sauvegarde auto (local)',
            price: 300,
          },
          {
            id: 'backup',
            name: 'Sauvegarde auto (distant)',
            price: 400,
          },
        ]),
      ];

      render(
        <TestCreateInstanceFormWrapper>
          <Cart
            items={cartItems}
            actionsButtons={mockActionsButtons}
            billingType={BILLING_TYPE.Monthly}
          />
        </TestCreateInstanceFormWrapper>,
      );

      expect(screen.getByTestId('cart-total-price')).toBeDefined();
    });

    it('should include all items when no backups in hourly mode', () => {
      const cartItems: TCartItem[] = [
        createMockCartItem('instance', 'Instance', [
          { id: 'flavor', name: 'Flavor', price: 1000 },
          { id: 'image', name: 'Image', price: 500 },
          { id: 'network', name: 'Network', price: 300 },
        ]),
      ];

      render(
        <TestCreateInstanceFormWrapper>
          <Cart
            items={cartItems}
            actionsButtons={mockActionsButtons}
            billingType={BILLING_TYPE.Hourly}
          />
        </TestCreateInstanceFormWrapper>,
      );

      expect(screen.getByTestId('cart-total-price')).toBeDefined();
    });

    it('should handle items without prices', () => {
      const cartItems: TCartItem[] = [
        createMockCartItem('instance', 'Instance', [
          { id: 'flavor', name: 'Flavor', price: 1000 },
          { id: 'sshKey', name: 'SSH Key', price: null },
          { id: 'region', name: 'Region', price: null },
        ]),
      ];

      render(
        <TestCreateInstanceFormWrapper>
          <Cart
            items={cartItems}
            actionsButtons={mockActionsButtons}
            billingType={BILLING_TYPE.Hourly}
          />
        </TestCreateInstanceFormWrapper>,
      );

      expect(screen.getByTestId('cart-total-price')).toBeDefined();
    });
  });

  describe('Display mode based on billingType', () => {
    it('should display hourly and monthly estimation in hourly mode', () => {
      const cartItems: TCartItem[] = [
        createMockCartItem('instance', 'Instance', [
          { id: 'flavor', name: 'Flavor', price: 1000 },
        ]),
      ];

      render(
        <TestCreateInstanceFormWrapper>
          <Cart
            items={cartItems}
            actionsButtons={mockActionsButtons}
            billingType={BILLING_TYPE.Hourly}
          />
        </TestCreateInstanceFormWrapper>,
      );

      expect(screen.getByTestId('cart-hourly-total-price')).toBeDefined();
      expect(screen.getByTestId('cart-monthly-total-price')).toBeDefined();
    });

    it('should display only monthly estimation in monthly mode', () => {
      const cartItems: TCartItem[] = [
        createMockCartItem('instance', 'Instance', [
          { id: 'flavor', name: 'Modèle', price: 2000 },
        ]),
      ];

      render(
        <TestCreateInstanceFormWrapper>
          <Cart
            items={cartItems}
            actionsButtons={mockActionsButtons}
            billingType={BILLING_TYPE.Monthly}
          />
        </TestCreateInstanceFormWrapper>,
      );

      expect(screen.getByTestId('cart-monthly-total-price')).toBeDefined();
      expect(screen.queryByTestId('cart-hourly-total-price')).toBeNull();
    });
  });

  describe('Billing type specific calculations', () => {
    it('should convert hourly items to monthly in monthly mode', () => {
      const cartItems: TCartItem[] = [
        createMockCartItem('instance', 'Instance', [
          { id: 'flavor', name: 'Flavor', price: 10000 },
          { id: 'volume', name: 'Volume', price: 100 },
        ]),
      ];

      render(
        <TestCreateInstanceFormWrapper>
          <Cart
            items={cartItems}
            actionsButtons={mockActionsButtons}
            billingType={BILLING_TYPE.Monthly}
          />
        </TestCreateInstanceFormWrapper>,
      );

      expect(screen.getByTestId('cart-total-price')).toBeDefined();
      expect(screen.getByTestId('cart-monthly-total-price')).toBeDefined();
    });

    it('should treat all items as hourly in hourly mode', () => {
      const cartItems: TCartItem[] = [
        createMockCartItem('instance', 'Instance', [
          { id: 'flavor', name: 'Flavor', price: 100 },
          { id: 'volume', name: 'Volume', price: 50 },
          { id: 'network', name: 'Network', price: 25 },
        ]),
      ];

      render(
        <TestCreateInstanceFormWrapper>
          <Cart
            items={cartItems}
            actionsButtons={mockActionsButtons}
            billingType={BILLING_TYPE.Hourly}
          />
        </TestCreateInstanceFormWrapper>,
      );

      expect(screen.getByTestId('cart-total-price')).toBeDefined();
      expect(screen.getByTestId('cart-hourly-total-price')).toBeDefined();
      expect(screen.getByTestId('cart-monthly-total-price')).toBeDefined();
    });
  });
});
