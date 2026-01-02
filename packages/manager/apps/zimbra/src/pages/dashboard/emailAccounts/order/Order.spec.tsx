import React from 'react';

import { waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { describe, expect } from 'vitest';

import emailAccountOrderTranslation from '@/public/translations/accounts/order/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

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
});
