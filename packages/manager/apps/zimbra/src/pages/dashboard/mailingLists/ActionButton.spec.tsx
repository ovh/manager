import React from 'react';

import { describe, expect } from 'vitest';

import { mailingListMock } from '@/data/api';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

import ActionButtonMailingList from './ActionButton.component';
import { getMailingListItem } from './MailingLists.page';

describe('MailingLists datagrid action menu', () => {
  it('should display 4 actions buttons', () => {
    const { container } = render(
      <ActionButtonMailingList item={getMailingListItem(mailingListMock)} />,
    );

    const menuItems = container.querySelectorAll('ods-popover ods-button');

    expect(menuItems.length).toBe(4);

    expect(menuItems[0]).toHaveAttribute('label', commonTranslation.edit_mailing_list);

    expect(menuItems[1]).toHaveAttribute('label', commonTranslation.define_members_mailing_list);

    expect(menuItems[2]).toHaveAttribute(
      'label',
      commonTranslation.configure_delegation_mailing_list,
    );

    expect(menuItems[3]).toHaveAttribute('label', 'delete');
  });
});
