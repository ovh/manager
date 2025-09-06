import React from 'react';

import { describe, expect } from 'vitest';

import accountTranslation from '@/public/translations/accounts/Messages_fr_FR.json';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render, waitFor } from '@/utils/test.provider';

import EmailAccountsDatagrid from './EmailAccountsDatagrid.component';

describe('EmailAccounts datagrid', () => {
  it('should render correctly', async () => {
    const { getByTestId, getByText } = render(<EmailAccountsDatagrid />);

    await waitFor(() => {
      expect(getByTestId('add-account-btn')).toBeInTheDocument();
    });

    const button = getByTestId('add-account-btn');

    // datagrid top bar is there
    expect(button).toHaveAttribute('label', accountTranslation.zimbra_account_account_add);

    // columns are displayed
    expect(getByText(commonTranslation.email_account)).toBeTruthy();
  });
});
