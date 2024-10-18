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

    expect(container.querySelectorAll('osds-menu-item').length).toBe(4);

    expect(container.querySelectorAll('osds-menu-item')[0]).toHaveTextContent(
      mailingListsTranslation.zimbra_mailinglists_datagrid_action_edit,
    );

    expect(container.querySelectorAll('osds-menu-item')[1]).toHaveTextContent(
      mailingListsTranslation.zimbra_mailinglists_datagrid_action_define_members,
    );

    expect(container.querySelectorAll('osds-menu-item')[2]).toHaveTextContent(
      mailingListsTranslation.zimbra_mailinglists_datagrid_action_configure_delegation,
    );

    expect(container.querySelectorAll('osds-menu-item')[3]).toHaveTextContent(
      mailingListsTranslation.zimbra_mailinglists_datagrid_action_delete,
    );
  });
});
