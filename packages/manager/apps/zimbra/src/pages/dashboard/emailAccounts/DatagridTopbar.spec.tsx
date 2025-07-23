import React from 'react';

import { describe, expect } from 'vitest';

import accountTranslation from '@/public/translations/accounts/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

import EmailAccounts from './EmailAccounts.page';

describe('Email accounts DatagridTopbar component', () => {
  it('should display correctly', () => {
    const { getByTestId } = render(<EmailAccounts />);

    const addButton = getByTestId('add-account-btn');

    expect(addButton).toHaveAttribute('label', accountTranslation.zimbra_account_account_add);

    const orderButton = getByTestId('order-account-btn');

    expect(orderButton).toHaveAttribute('label', accountTranslation.zimbra_account_account_order);
  });
});
