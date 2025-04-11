import React from 'react';
import { describe, expect } from 'vitest';
import ActionButtonUsers from './ActionButtonUsers.component';
import { render } from '@/utils/test.provider';
import usersTranslation from '@/public/translations/dashboard/users/Messages_fr_FR.json';
import {
  licensesMock,
  licensesPrepaidExpandedMock,
  usersMock,
} from '@/data/api/_mock_';

describe('Users datagrid (licence) action menu', () => {
  it('we have good number of item with good content for office native user', () => {
    const { container } = render(
      <ActionButtonUsers
        usersItem={usersMock[0]}
        licenceDetail={licensesMock[0]}
      />,
    );

    const menuItems = container.querySelectorAll('ods-popover ods-button');

    expect(menuItems.length).toBe(3);

    expect(menuItems[0]).toHaveAttribute(
      'label',
      usersTranslation.dashboard_users_action_user_edit,
    );
    expect(menuItems[1]).toHaveAttribute(
      'label',
      usersTranslation.dashboard_users_action_user_change_password,
    );
    expect(menuItems[2]).toHaveAttribute(
      'label',
      usersTranslation.dashboard_users_action_user_delete,
    );
  });

  it('we have good number of item with good content for officePrepaid configured user', () => {
    const { container } = render(
      <ActionButtonUsers
        usersItem={licensesPrepaidExpandedMock[1]}
        licenceDetail={licensesPrepaidExpandedMock[1]}
      />,
    );

    const menuItems = container.querySelectorAll('ods-popover ods-button');

    expect(menuItems.length).toBe(3);

    expect(menuItems[0]).toHaveAttribute(
      'label',
      usersTranslation.dashboard_users_action_user_edit,
    );
    expect(menuItems[1]).toHaveAttribute(
      'label',
      usersTranslation.dashboard_users_action_user_change_password,
    );

    expect(menuItems[2]).toHaveAttribute(
      'label',
      usersTranslation.dashboard_users_action_user_delete,
    );
  });

  it('we have good number of item with good content for officePrepaid unconfigured user', () => {
    const { container } = render(
      <ActionButtonUsers
        usersItem={licensesPrepaidExpandedMock[0]}
        licenceDetail={licensesPrepaidExpandedMock[0]}
      />,
    );

    const menuItems = container.querySelectorAll('ods-popover ods-button');

    expect(menuItems.length).toBe(1);

    expect(menuItems[0]).toHaveAttribute(
      'label',
      usersTranslation.dashboard_users_action_user_edit,
    );
  });
});
