import { fireEvent, waitFor } from '@testing-library/dom';
import { act } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';

import { orderCatalogMock } from '@/data/api';
import { render } from '@/utils/test.provider';

import OrderCatalogForm from './OrderCatalogForm.component';

describe('Order catalog form', () => {
  // Can't find a way to test ods-quantity, ::part css selector doesnt seems to work
  it.skip('should have a correct form validation and call window open on confirm', async () => {
    const { getByTestId, queryByTestId, container } = render(
      <OrderCatalogForm
        catalog={orderCatalogMock}
        orderBaseURL="https://ovhcloud.com"
        locale="FR"
        goBack={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const windowOpen = vi.spyOn(window, 'open');
    const button = getByTestId('order-account-confirm-btn');
    const consent = getByTestId('consent');
    // can't find a way to select - and + buttons with a selector
    // that works like ods-quantity::part(button-minus)
    const quantityMinus = container.querySelector('ods-quantity::part(button-minus)');
    const quantityPlus = container.querySelector('ods-quantity::part(button-minus)');

    expect(button).toHaveAttribute('is-disabled', 'true');

    act(() => {
      // on
      fireEvent.click(consent);
    });

    expect(button).toHaveAttribute('is-disabled', 'true');

    act(() => {
      // off
      fireEvent.click(consent);
      // quantity 1
      fireEvent.click(quantityPlus);
    });

    expect(button).toHaveAttribute('is-disabled', 'true');

    act(() => {
      // on
      fireEvent.click(consent);
      // quantity 0
      fireEvent.click(quantityMinus);
    });

    expect(button).toHaveAttribute('is-disabled', 'true');

    act(() => {
      // quantity 1
      fireEvent.click(quantityPlus);
    });

    expect(button).toHaveAttribute('is-disabled', 'false');

    act(() => {
      fireEvent.click(button);
    });

    expect(windowOpen).toHaveBeenCalledOnce();

    const orderGeneratedTile = getByTestId('order-generated-tile');

    expect(orderGeneratedTile).toBeVisible();
  });
});
