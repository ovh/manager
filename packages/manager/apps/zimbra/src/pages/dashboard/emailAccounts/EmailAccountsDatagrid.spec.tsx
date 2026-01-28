import React from 'react';

import { waitFor } from '@testing-library/dom';
import { describe, expect } from 'vitest';

import actionsCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

import EmailAccountsDatagrid from './EmailAccountsDatagrid.component';

describe('EmailAccounts datagrid', () => {
  it('should render correctly', async () => {
    const { getByTestId, getByText } = render(<EmailAccountsDatagrid />);

    await waitFor(() => {
      expect(getByTestId('add-account-btn')).toBeInTheDocument();
    });

    const button = getByTestId('add-account-btn');

    // datagrid top bar is there
    expect(button).toHaveTextContent(actionsCommonTranslation.configure);

    // columns are displayed
    expect(getByText(commonTranslation.email_account)).toBeTruthy();
  });
});
