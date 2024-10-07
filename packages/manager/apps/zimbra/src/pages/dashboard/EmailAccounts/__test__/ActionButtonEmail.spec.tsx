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

    expect(container.querySelectorAll('osds-menu-item').length).toBe(2);

    expect(container.querySelectorAll('osds-menu-item')[0]).toHaveTextContent(
      accountTranslation.zimbra_account_datagrid_tooltip_modification,
    );

    expect(container.querySelectorAll('osds-menu-item')[1]).toHaveTextContent(
      accountTranslation.zimbra_account_datagrid_tooltip_delete,
    );
  });
});
