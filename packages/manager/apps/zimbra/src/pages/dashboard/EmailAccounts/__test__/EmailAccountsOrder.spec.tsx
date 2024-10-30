import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { describe, expect, vi } from 'vitest';
import { fireEvent, render, waitFor, act } from '@/utils/test.provider';
import EmailAccountsOrder from '../EmailAccountsOrder.page';
import emailAccountOrderTranslation from '@/public/translations/accounts/order/Messages_fr_FR.json';

describe('email account order page', () => {
  it('should render page correctly', async () => {
    const { getByTestId, queryByTestId } = render(<EmailAccountsOrder />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(getByTestId('page-title')).toHaveTextContent(
      emailAccountOrderTranslation.zimbra_account_order_title,
    );
  });

  it('should have a correct form validation and call window open on confirm', async () => {
    const { getByTestId, queryByTestId } = render(<EmailAccountsOrder />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const windowOpen = vi.spyOn(window, 'open');
    const button = getByTestId('order-account-confirm-btn');
    const consent = getByTestId('checkbox-consent');
    const quantityPlus = getByTestId('quantity-plus');
    const quantityMinus = getByTestId('quantity-minus');

    expect(button).toBeDisabled();

    await act(() => {
      // on
      fireEvent.click(consent);
    });

    expect(button).toBeDisabled();

    await act(() => {
      // off
      fireEvent.click(consent);
      // quantity 1
      fireEvent.click(quantityPlus);
    });

    expect(button).toBeDisabled();

    await act(() => {
      // on
      fireEvent.click(consent);
      // quantity 0
      fireEvent.click(quantityMinus);
    });

    expect(button).toBeDisabled();

    await act(() => {
      // quantity 1
      fireEvent.click(quantityPlus);
    });

    expect(button).toBeEnabled();

    await act(() => {
      fireEvent.click(button);
    });

    expect(windowOpen).toHaveBeenCalledOnce();

    const orderGeneratedTile = getByTestId('order-generated-tile');

    expect(orderGeneratedTile).toBeVisible();
  });
});
