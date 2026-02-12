import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { Accordion, AccordionItem, Text } from '@ovhcloud/ods-react';

import { CartItemHeader } from '../components/CartItemHeader.component';

const headerText = 'Header text';

describe('Considering CartItemHeader component', () => {
  test('Should render children', () => {
    render(
      <Accordion value={['test-item']}>
        <AccordionItem value="test-item">
          <CartItemHeader>
            <Text>{headerText}</Text>
          </CartItemHeader>
        </AccordionItem>
      </Accordion>,
    );

    const cartItemHeaderElement = screen.getByTestId('cart-item-header');

    expect(cartItemHeaderElement).toBeInTheDocument();
    expect(cartItemHeaderElement).toHaveTextContent(headerText);
  });
});
