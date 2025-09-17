import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Accordion } from '@ovhcloud/ods-react';
import { CartItem } from '../components';

const cartItems = [
  { id: 'openedItem1', state: 'open' },
  { id: 'hiddenItem2', state: 'closed' },
  { id: 'openedItem3', state: 'open' },
];

describe('Considering CartItem component', () => {
  test.each(cartItems)(
    'Should render correct expanded state',
    ({ id, state }) => {
      const cartItemsExpandedStates = ['openedItem1', 'openedItem3'];

      render(
        <Accordion value={cartItemsExpandedStates}>
          <CartItem value={id}>
            <p>{id}</p>
          </CartItem>
        </Accordion>,
      );

      const cartItemTitleElement = screen.getByText(id);
      const cartItemElement = screen.getByTestId(`cart-item-${id}`);

      expect(cartItemTitleElement).toBeInTheDocument();
      expect(cartItemElement).toHaveAttribute('data-state', state);
    },
  );
});
