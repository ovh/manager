import React from 'react';
import { describe, expect } from 'vitest';
import ActionButtonEmail from './ActionButton.component';
import { render } from '@/utils/test.provider';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';

describe('EmailAccounts datagrid action menu', () => {
  it('we have good number of item with good content', () => {
    const { container } = render(
      <ActionButtonEmail
        item={{
          id: '1',
          email: 'test@test.fr',
          offer: 'STARTER',
          organizationId: '2',
          organizationLabel: 'testorgLabel',
          used: 1,
          available: 2,
          status: 'READY',
        }}
      />,
    );

    const menuItems = container.querySelectorAll('ods-popover ods-button');

    expect(menuItems.length).toBe(2);

    expect(menuItems[0]).toHaveAttribute('label', commonTranslation.modify);

    expect(menuItems[1]).toHaveAttribute('label', commonTranslation.delete);
  });
});
