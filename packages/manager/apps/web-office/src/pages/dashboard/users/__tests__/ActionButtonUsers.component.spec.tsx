import React from 'react';

import { describe, expect } from 'vitest';

import { licensesMock, licensesPrepaidExpandedMock } from '@/data/api/__mocks__/license';
import { usersMock } from '@/data/api/__mocks__/user';
import usersTranslation from '@/public/translations/dashboard/users/Messages_fr_FR.json';
import { render } from '@/utils/Test.provider';

import ActionButtonUsers from '../ActionButtonUsers.component';

describe('Users datagrid (licence) action menu', () => {
  it('we have good number of item with good content for office native user', () => {
    const { container } = render(
      <ActionButtonUsers usersItem={usersMock[0]} licenceDetail={licensesMock[0]} />,
    );

    const menuItems = container.querySelectorAll('ods-popover ods-button');

    expect(menuItems.length).toBe(3);

    expect(menuItems[0]).toHaveAttribute('label', usersTranslation.edit_account);
    expect(menuItems[1]).toHaveAttribute('label', usersTranslation.change_password);
    expect(menuItems[2]).toHaveAttribute('label', usersTranslation.delete_account);
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

    expect(menuItems[0]).toHaveAttribute('label', usersTranslation.edit_account);
    expect(menuItems[1]).toHaveAttribute('label', usersTranslation.change_password);

    expect(menuItems[2]).toHaveAttribute('label', usersTranslation.delete_account);
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

    expect(menuItems[0]).toHaveAttribute('label', usersTranslation.edit_account);
  });
});
