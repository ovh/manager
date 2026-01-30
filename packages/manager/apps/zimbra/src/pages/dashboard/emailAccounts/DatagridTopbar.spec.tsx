import React from 'react';

import { describe, expect } from 'vitest';

import actionsCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import { render } from '@/utils/test.provider';

import EmailAccounts from './EmailAccounts.page';

describe('Email accounts DatagridTopbar component', () => {
  it('should display correctly', () => {
    const { getByTestId } = render(<EmailAccounts />);

    const addButton = getByTestId('add-account-btn');

    expect(addButton).toHaveTextContent(actionsCommonTranslation.configure);

    const orderButton = getByTestId('order-account-btn');

    expect(orderButton).toHaveTextContent(actionsCommonTranslation.order);
  });
});
