import React from 'react';
import { describe, expect } from 'vitest';
import ActionButtonSlot from './ActionButton.component';
import { render } from '@/utils/test.provider';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { ZimbraOffer } from '@/data/api';

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

    expect(menuItems[0]).toHaveAttribute(
      'label',
      commonTranslation.configure_account,
    );
  });
});
