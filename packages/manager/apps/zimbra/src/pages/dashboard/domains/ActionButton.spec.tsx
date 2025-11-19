import React from 'react';

import { screen } from '@testing-library/dom';
import { describe, expect } from 'vitest';

import actionsCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

import ActionButtonDomain from './ActionButton.component';

describe('Domains datagrid action menu', () => {
  it('we have good number of item with good content', () => {
    render(
      <ActionButtonDomain
        item={{
          id: '1',
          name: 'test.fr',
          organizationId: '1',
          organizationLabel: 'testorgLabel',
          account: 1,
          status: 'READY',
        }}
      />,
    );

    const menuItems = screen.getAllByTestId('manager-button');

    expect(menuItems).toHaveLength(3);
    expect(menuItems[0]).toHaveTextContent(actionsCommonTranslation.configure);
    expect(menuItems[1]).toHaveTextContent(commonTranslation.diagnostics);
    expect(menuItems[2]).toHaveTextContent(actionsCommonTranslation.delete);
  });
});
