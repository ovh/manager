import React from 'react';

import { screen } from '@testing-library/dom';
import { describe, expect } from 'vitest';

import { ZimbraOffer } from '@/data/api';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

import ActionButtonSlot from './ActionButton.component';

describe('Slots datagrid action menu', () => {
  it('should have the defined actions', () => {
    render(
      <ActionButtonSlot
        item={{
          id: '1',
          offer: ZimbraOffer.STARTER,
        }}
      />,
    );

    const menuItems = screen.getAllByTestId('manager-button');
    expect(menuItems.length).toBe(2);
    expect(menuItems[0]).toHaveTextContent(commonTranslation.configure_account);
  });
});
