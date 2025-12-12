import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Button } from '@ovhcloud/ods-react';
import { CartActions } from '../components';

const cartCancelText = 'Cancel';
const cartSubmitText = 'Submit';

describe('Considering CartActions component', () => {
  test('Should render children', () => {
    render(
      <CartActions>
        <Button>{cartCancelText}</Button>
        <Button>{cartSubmitText}</Button>
      </CartActions>,
    );

    const cartActionsElement = screen.getByTestId('cart-actions');

    expect(cartActionsElement).toBeInTheDocument();
    expect(cartActionsElement).toHaveTextContent(cartCancelText);
    expect(cartActionsElement).toHaveTextContent(cartSubmitText);
  });
});
