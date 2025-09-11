import React from 'react';

import { describe, expect } from 'vitest';

import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

import ActionButtonDomain from './ActionButton.component';

describe('Domains datagrid action menu', () => {
  it('we have good number of item with good content', () => {
    const { container } = render(
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

    const menuItems = container.querySelectorAll('ods-popover ods-button');

    expect(menuItems.length).toBe(3);

    expect(menuItems[0]).toHaveAttribute('label', 'configure');

    expect(menuItems[1]).toHaveAttribute('label', commonTranslation.diagnostics);

    expect(menuItems[2]).toHaveAttribute('label', 'delete');
  });
});
