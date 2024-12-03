import React from 'react';
import { describe, expect } from 'vitest';
import ActionButtonMailingList from '../ActionButtonMailingList.component';
import { render } from '@/utils/test.provider';
import mailingListsTranslation from '@/public/translations/mailinglists/Messages_fr_FR.json';
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
      mailingListsTranslation.zimbra_mailinglists_datagrid_action_edit,
    );

    expect(menuItems[1]).toHaveAttribute(
      'label',
      mailingListsTranslation.zimbra_mailinglists_datagrid_action_define_members,
    );

    expect(menuItems[2]).toHaveAttribute(
      'label',
      mailingListsTranslation.zimbra_mailinglists_datagrid_action_configure_delegation,
    );

    expect(menuItems[3]).toHaveAttribute(
      'label',
      mailingListsTranslation.zimbra_mailinglists_datagrid_action_delete,
    );
  });
});
