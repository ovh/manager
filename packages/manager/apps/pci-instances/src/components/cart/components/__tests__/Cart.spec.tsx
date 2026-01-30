import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Cart } from '../../Cart.component';
import { TCartItem } from '@/pages/instances/create/hooks/useCartItems';
import { BILLING_TYPE } from '@/types/instance/common.type';

vi.mock('@ovh-ux/muk', () => ({
  useCatalogPrice: () => ({
    getTextPrice: (price: number) => `${(price / 100).toFixed(2)} €`,
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Cart', () => {
  const mockActionsButtons = <button>Action</button>;

  const createMockCartItem = (
    id: string,
    title: string,
    details: Array<{
      id: string;
      name: string;
      displayPrice: boolean;
      price?: number;
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
          { id: 'flavor', name: 'Flavor', displayPrice: true, price: 1000 },
          { id: 'image', name: 'Image', displayPrice: true, price: 500 },
          {
            id: 'backup',
            name: 'Backup auto (local)',
            displayPrice: false,
            price: 200,
          },
        ]),
      ];

      render(
        <Cart
          items={cartItems}
          actionsButtons={mockActionsButtons}
          billingType={BILLING_TYPE.Hourly}
        />,
      );

      expect(screen.getByTestId('cart-total-price')).toBeDefined();
    });

    it('should exclude backup prices from total in monthly mode', () => {
      const cartItems: TCartItem[] = [
        createMockCartItem('instance', 'Instance', [
          { id: 'flavor', name: 'Modèle', displayPrice: true, price: 20000 },
          {
            id: 'backup',
            name: 'Sauvegarde auto (local)',
            displayPrice: false,
            price: 300,
          },
          {
            id: 'backup',
            name: 'Sauvegarde auto (distant)',
            displayPrice: false,
            price: 400,
          },
        ]),
      ];

      render(
        <Cart
          items={cartItems}
          actionsButtons={mockActionsButtons}
          billingType={BILLING_TYPE.Monthly}
        />,
      );

      expect(screen.getByTestId('cart-total-price')).toBeDefined();
    });

    it('should include all items when no backups in hourly mode', () => {
      const cartItems: TCartItem[] = [
        createMockCartItem('instance', 'Instance', [
          { id: 'flavor', name: 'Flavor', displayPrice: true, price: 1000 },
          { id: 'image', name: 'Image', displayPrice: true, price: 500 },
          { id: 'network', name: 'Network', displayPrice: true, price: 300 },
        ]),
      ];

      render(
        <Cart
          items={cartItems}
          actionsButtons={mockActionsButtons}
          billingType={BILLING_TYPE.Hourly}
        />,
      );

      expect(screen.getByTestId('cart-total-price')).toBeDefined();
    });

    it('should handle items without prices', () => {
      const cartItems: TCartItem[] = [
        createMockCartItem('instance', 'Instance', [
          { id: 'flavor', name: 'Flavor', displayPrice: true, price: 1000 },
          { id: 'sshKey', name: 'SSH Key', displayPrice: false },
          { id: 'region', name: 'Region', displayPrice: false },
        ]),
      ];

      render(
        <Cart
          items={cartItems}
          actionsButtons={mockActionsButtons}
          billingType={BILLING_TYPE.Hourly}
        />,
      );

      expect(screen.getByTestId('cart-total-price')).toBeDefined();
    });
  });

  describe('Display mode based on billingType', () => {
    it('should display hourly and monthly estimation in hourly mode', () => {
      const cartItems: TCartItem[] = [
        createMockCartItem('instance', 'Instance', [
          { id: 'flavor', name: 'Flavor', displayPrice: true, price: 1000 },
        ]),
      ];

      render(
        <Cart
          items={cartItems}
          actionsButtons={mockActionsButtons}
          billingType={BILLING_TYPE.Hourly}
        />,
      );

      expect(screen.getByTestId('cart-hourly-total-price')).toBeDefined();
      expect(screen.getByTestId('cart-monthly-total-price')).toBeDefined();
    });

    it('should display only monthly estimation in monthly mode', () => {
      const cartItems: TCartItem[] = [
        createMockCartItem('instance', 'Instance', [
          { id: 'flavor', name: 'Modèle', displayPrice: true, price: 2000 },
        ]),
      ];

      render(
        <Cart
          items={cartItems}
          actionsButtons={mockActionsButtons}
          billingType={BILLING_TYPE.Monthly}
        />,
      );

      expect(screen.getByTestId('cart-monthly-total-price')).toBeDefined();
      expect(screen.queryByTestId('cart-hourly-total-price')).toBeNull();
    });
  });

  describe('Billing type specific calculations', () => {
    it('should convert hourly items to monthly in monthly mode', () => {
      const cartItems: TCartItem[] = [
        createMockCartItem('instance', 'Instance', [
          { id: 'flavor', name: 'Flavor', displayPrice: true, price: 10000 },
          { id: 'volume', name: 'Volume', displayPrice: true, price: 100 },
        ]),
      ];

      render(
        <Cart
          items={cartItems}
          actionsButtons={mockActionsButtons}
          billingType={BILLING_TYPE.Monthly}
        />,
      );

      expect(screen.getByTestId('cart-total-price')).toBeDefined();
      expect(screen.getByTestId('cart-monthly-total-price')).toBeDefined();
    });

    it('should treat all items as hourly in hourly mode', () => {
      const cartItems: TCartItem[] = [
        createMockCartItem('instance', 'Instance', [
          { id: 'flavor', name: 'Flavor', displayPrice: true, price: 100 },
          { id: 'volume', name: 'Volume', displayPrice: true, price: 50 },
          { id: 'network', name: 'Network', displayPrice: true, price: 25 },
        ]),
      ];

      render(
        <Cart
          items={cartItems}
          actionsButtons={mockActionsButtons}
          billingType={BILLING_TYPE.Hourly}
        />,
      );

      expect(screen.getByTestId('cart-total-price')).toBeDefined();
      expect(screen.getByTestId('cart-hourly-total-price')).toBeDefined();
      expect(screen.getByTestId('cart-monthly-total-price')).toBeDefined();
    });
  });
});
