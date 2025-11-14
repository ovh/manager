import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { CartContent } from '../components/CartContent.component';
import { TCartItem, TCartItemDetail } from '../Cart.component';
import { CartItem } from '../components';

const instanceItemTitle = 'instance';
const instanceItemName = 'instance_01';
const kubeItemTitle = 'kube';
const kubeItemName = 'kube_01';

const details: TCartItemDetail[] = [
  {
    name: 'localisation',
  },
];

const cartItems: TCartItem[] = [
  {
    id: '0',
    title: instanceItemTitle,
    name: instanceItemName,
    details,
    expanded: true,
  },
  {
    id: '1',
    title: kubeItemTitle,
    name: kubeItemName,
    details,
    expanded: false,
  },
];

describe('Considering CartContent component', () => {
  test('Should return expected items', () => {
    render(
      <CartContent
        items={cartItems}
        renderCartItem={({ item, isExpanded }) => (
          <CartItem
            key={item.title}
            value={item.title}
            data-testid={item.title}
          >
            <p>
              {`${item.name} ${isExpanded(item.id) ? 'expanded' : 'collapsed'}`}
            </p>
          </CartItem>
        )}
      />,
    );

    const cartContentElement = screen.getByTestId('cart-content');
    const instanceElement = screen.getByTestId(
      `cart-item-${instanceItemTitle}`,
    );
    const kubeElement = screen.getByTestId(`cart-item-${kubeItemTitle}`);

    expect(instanceElement).toHaveTextContent(`${instanceItemName} expanded`);
    expect(kubeElement).toHaveTextContent(`${kubeItemName} collapsed`);
    expect(cartContentElement.children).toHaveLength(cartItems.length);
  });
});
