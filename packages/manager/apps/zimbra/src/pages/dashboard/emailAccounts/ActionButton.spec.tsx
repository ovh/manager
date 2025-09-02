import React from 'react';

import { describe, expect } from 'vitest';

import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

import ActionButtonEmail from './ActionButton.component';

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
          slotId: '123-123',
          detailedStatus: [
            {
              details: 'string',
              link: 'string',
              status: 'BILLINGLOCKED',
            },
          ],
        }}
      />,
    );

    const menuItems = container.querySelectorAll('ods-popover ods-button');

    expect(menuItems.length).toBe(3);

    expect(menuItems[0]).toHaveAttribute('label', 'modify');

    expect(menuItems[1]).toHaveAttribute('label', commonTranslation.alias);

    expect(menuItems[2]).toHaveAttribute('label', 'delete');
  });
});
