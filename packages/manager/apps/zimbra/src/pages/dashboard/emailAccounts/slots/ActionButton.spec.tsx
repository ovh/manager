import React from 'react';

import { describe, expect } from 'vitest';

import { ZimbraOffer } from '@/data/api';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

import ActionButtonSlot from './ActionButton.component';

describe('Slots datagrid action menu', () => {
  it('should have the defined actions', () => {
    const { container } = render(
      <ActionButtonSlot
        item={{
          id: '1',
          offer: ZimbraOffer.STARTER,
        }}
      />,
    );

    const menuItems = container.querySelectorAll('ods-popover ods-button');

    expect(menuItems.length).toBe(1);

    expect(menuItems[0]).toHaveAttribute('label', commonTranslation.configure_account);
  });
});
