import React from 'react';

import { describe, expect } from 'vitest';

import accountTranslation from '@/public/translations/accounts/Messages_fr_FR.json';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { act, fireEvent, render, waitFor } from '@/utils/test.provider';

import EmailAccounts from './EmailAccounts.page';

describe('EmailAccounts page', () => {
  it('Page should display correctly', async () => {
    const { getByTestId } = render(<EmailAccounts />);

    await waitFor(() => {
      expect(getByTestId('add-account-btn')).toBeInTheDocument();
    });

    const button = getByTestId('add-account-btn');

    expect(button).toHaveAttribute('label', accountTranslation.zimbra_account_account_add);

    expect(button).toHaveAttribute('is-disabled', 'true');
  });

  it('should have accounts displayed by default', async () => {
    const { getByTestId, getByText } = render(<EmailAccounts />);

    await waitFor(() => {
      expect(getByTestId('switch')).toBeInTheDocument();
    });

    const switchAccounts = getByTestId('switch-accounts');

    expect(switchAccounts).toHaveAttribute('is-checked', 'true');

    expect(getByText(commonTranslation.email_account)).toBeTruthy();
  });

  it('should switch to slots when clicked', async () => {
    const { getByTestId, getByText } = render(<EmailAccounts />);

    await waitFor(() => {
      expect(getByTestId('switch')).toBeInTheDocument();
    });

    const switchSlots = getByTestId('switch-slots');

    expect(getByText(commonTranslation.email_account)).toBeTruthy();

    act(() => {
      fireEvent.click(switchSlots);
    });

    expect(getByText(accountTranslation.zimbra_account_datagrid_renewal_date)).toBeTruthy();
  });
});
