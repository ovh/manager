import React from 'react';

import { screen } from '@testing-library/dom';
import { describe, expect } from 'vitest';

import actionsCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import { mailingListMock } from '@/data/api';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

import ActionButtonMailingList from './ActionButton.component';
import { getMailingListItem } from './MailingLists.page';

describe('MailingLists datagrid action menu', () => {
  it('should display 4 actions buttons', () => {
    render(<ActionButtonMailingList item={getMailingListItem(mailingListMock)} />);

    const menuItems = screen.getAllByTestId('manager-button');

    expect(menuItems.length).toBe(4);
    expect(menuItems[0]).toHaveTextContent(commonTranslation.edit_mailing_list);
    expect(menuItems[1]).toHaveTextContent(commonTranslation.define_members_mailing_list);
    expect(menuItems[2]).toHaveTextContent(commonTranslation.configure_delegation_mailing_list);
    expect(menuItems[3]).toHaveTextContent(actionsCommonTranslation.delete);
  });
});
