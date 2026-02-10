import React from 'react';

import { screen } from '@testing-library/dom';
import { describe, expect, it } from 'vitest';

import actionsCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import { ZimbraOffer } from '@/data/api';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

import ActionButtonService from './ActionButton.component';

describe('Services datagrid action menu', () => {
  it('renders correct action buttons with translations', () => {
    render(
      <ActionButtonService
        item={{
          accountId: '14321',
          email: 'test@test.fr',
          id: '1',
          offer: ZimbraOffer.STARTER,
          organizationId: '2',
          organizationLabel: 'testorgLabel',
          status: 'READY',
          service: {
            id: 1,
            state: 'AUTOMATIC_RENEWAL',
          },
        }}
      />,
    );
    const menuItems = screen.getAllByTestId('manager-button');

    expect(menuItems.length).toBe(5);
    expect(menuItems[0]).toHaveTextContent(actionsCommonTranslation.modify);
    expect(menuItems[1]).toHaveTextContent(commonTranslation.update_offer);
    expect(menuItems[2]).toHaveTextContent(commonTranslation.alias);
    expect(menuItems[3]).toHaveTextContent(actionsCommonTranslation.delete);
    expect(menuItems[4]).toHaveTextContent(actionsCommonTranslation.terminate);
  });
});
