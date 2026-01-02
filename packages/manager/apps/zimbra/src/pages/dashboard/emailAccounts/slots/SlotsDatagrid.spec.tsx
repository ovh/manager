import React from 'react';

import { waitFor } from '@testing-library/dom';
import { describe, expect } from 'vitest';

import accountTranslation from '@/public/translations/accounts/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

import SlotsDatagrid from './SlotsDatagrid.component';

describe('Slots datagrid', () => {
  it('should render correctly', async () => {
    const { getByTestId, getByText } = render(<SlotsDatagrid />);

    await waitFor(() => {
      expect(getByTestId('add-account-btn')).toBeInTheDocument();
    });

    const button = getByTestId('add-account-btn');

    // datagrid top bar is there
    expect(button).toHaveTextContent(accountTranslation.zimbra_account_account_add);

    // columns are displayed
    expect(getByText(accountTranslation.zimbra_account_datagrid_renewal_date)).toBeTruthy();
  });
});
