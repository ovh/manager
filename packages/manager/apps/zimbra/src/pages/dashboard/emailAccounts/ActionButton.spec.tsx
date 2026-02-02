import React from 'react';

import { screen } from '@testing-library/dom';
import { describe, expect } from 'vitest';

import actionsCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

import ActionButtonEmail from './ActionButton.component';

describe('EmailAccounts datagrid action menu', () => {
  it('we have good number of item with good content', () => {
    render(
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

    const menuItems = screen.getAllByTestId('manager-button');

    expect(menuItems.length).toBe(4);
    expect(menuItems[0]).toHaveTextContent(actionsCommonTranslation.modify);
    expect(menuItems[1]).toHaveTextContent(commonTranslation.alias);
    expect(menuItems[2]).toHaveTextContent(commonTranslation.update_offer);
    expect(menuItems[3]).toHaveTextContent(actionsCommonTranslation.delete);
  });
});
