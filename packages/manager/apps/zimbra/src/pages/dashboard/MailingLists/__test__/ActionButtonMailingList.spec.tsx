import React from 'react';
import { describe, expect } from 'vitest';
import ActionButtonMailingList from '../ActionButtonMailingList.component';
import { render } from '@/utils/test.provider';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { mailingListDetailMock } from '@/api/_mock_';
import { getMailingListItem } from '../MailingLists';

describe('MailingLists datagrid action menu', () => {
  it('should display 4 actions buttons', () => {
    const { container } = render(
      <ActionButtonMailingList
        mailingListItem={getMailingListItem(mailingListDetailMock)}
      />,
    );

    const menuItems = container.querySelectorAll('ods-popover ods-button');

    expect(menuItems.length).toBe(4);

    expect(menuItems[0]).toHaveAttribute(
      'label',
      commonTranslation.edit_mailing_list,
    );

    expect(menuItems[1]).toHaveAttribute(
      'label',
      commonTranslation.define_members_mailing_list,
    );

    expect(menuItems[2]).toHaveAttribute(
      'label',
      commonTranslation.configure_delegation_mailing_list,
    );

    expect(menuItems[3]).toHaveAttribute('label', commonTranslation.delete);
  });
});
