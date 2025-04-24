import React from 'react';
import { describe, expect } from 'vitest';
import EmailAccounts from './EmailAccounts.page';
import { render, waitFor } from '@/utils/test.provider';
import accountTranslation from '@/public/translations/accounts/Messages_fr_FR.json';

describe('EmailAccounts page', () => {
  it('Page should display correctly', async () => {
    const { getByTestId } = render(<EmailAccounts />);

    await waitFor(() => {
      expect(getByTestId('add-account-btn')).toBeInTheDocument();
    });

    const button = getByTestId('add-account-btn');

    expect(button).toHaveAttribute(
      'label',
      accountTranslation.zimbra_account_account_add,
    );

    expect(button).toHaveAttribute('is-disabled', 'true');
  });
});
