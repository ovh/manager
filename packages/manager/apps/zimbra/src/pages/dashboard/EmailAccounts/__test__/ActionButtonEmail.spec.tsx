import React from 'react';
import { describe, expect } from 'vitest';
import ActionButtonEmail from '../ActionButtonEmail.component';
import { render } from '@/utils/test.provider';
import accountTranslation from '@/public/translations/accounts/Messages_fr_FR.json';
import { accountsMock } from '@/api/_mock_';

describe('EmailAccounts datagrid action menu', () => {
  it('we have good number of item with good content', () => {
    const { container } = render(
      <ActionButtonEmail emailsItem={accountsMock[0]} />,
    );

    const menuItems = container.querySelectorAll('ods-popover ods-button');

    expect(menuItems.length).toBe(2);

    expect(menuItems[0]).toHaveAttribute(
      'label',
      accountTranslation.zimbra_account_datagrid_tooltip_modification,
    );

    expect(menuItems[1]).toHaveAttribute(
      'label',
      accountTranslation.zimbra_account_datagrid_tooltip_delete,
    );
  });
});
