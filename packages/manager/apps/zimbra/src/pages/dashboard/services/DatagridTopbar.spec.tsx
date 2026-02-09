import React from 'react';

import { describe, expect } from 'vitest';

import accountTranslation from '@/public/translations/accounts/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

import Services from './Services.page';

describe('Services DatagridTopbar component', () => {
  it('should display correctly', () => {
    const { getByTestId } = render(<Services />);

    const addButton = getByTestId('add-account-btn');
    expect(addButton).toHaveTextContent(accountTranslation.zimbra_account_account_add);
  });
});
