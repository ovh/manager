import React from 'react';

import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';

import emailAccountOrderTranslation from '@/public/translations/accounts/order/Messages_fr_FR.json';
import { act, fireEvent, render, waitFor } from '@/utils/test.provider';

import OrderEmailAccounts from './Order.page';

describe('email account order page', () => {
  it('should render page correctly', async () => {
    const { getByTestId, queryByTestId } = render(<OrderEmailAccounts />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(getByTestId('page-title')).toHaveTextContent(
      emailAccountOrderTranslation.zimbra_account_order_title,
    );
  });

  // Can't find a way to test ods-quantity, ::part css selector doesnt seems to work
  it.skip('should have a correct form validation and call window open on confirm', async () => {
    const { getByTestId, queryByTestId, container } = render(<OrderEmailAccounts />);

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
