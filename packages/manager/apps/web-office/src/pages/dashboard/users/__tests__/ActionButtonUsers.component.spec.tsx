import { describe, expect } from 'vitest';

import actions from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import { licensesMock, licensesPrepaidExpandedMock } from '@/data/api/__mocks__/license';
import { usersMock } from '@/data/api/__mocks__/user';
import { renderWithRouter } from '@/utils/Test.provider';

import ActionButtonUsers from '../ActionButtonUsers.component';

describe('Users datagrid (licence) action menu', () => {
  it('we have good number of item with good content for office native user', () => {
    const { getAllByTestId } = renderWithRouter(
      <ActionButtonUsers usersItem={usersMock[0]} licenceDetail={licensesMock[0]} />,
    );

    const menuItems = getAllByTestId('manager-button-without-tooltip');

    expect(menuItems.length).toBe(3);

    expect(menuItems[0]).toHaveTextContent(actions.edit_account);
    expect(menuItems[1]).toHaveTextContent(actions.change_password);
    expect(menuItems[2]).toHaveTextContent(actions.delete_account);
  });

  it('we have good number of item with good content for officePrepaid configured user', () => {
    const { getAllByTestId } = renderWithRouter(
      <ActionButtonUsers
        usersItem={licensesPrepaidExpandedMock[1]}
        licenceDetail={licensesPrepaidExpandedMock[1]}
      />,
    );

    const menuItems = getAllByTestId('manager-button-without-tooltip');

    expect(menuItems.length).toBe(3);

    expect(menuItems[0]).toHaveTextContent(actions.edit_account);
    expect(menuItems[1]).toHaveTextContent(actions.change_password);
    expect(menuItems[2]).toHaveTextContent(actions.delete_account);
  });

  it('we have good number of item with good content for officePrepaid unconfigured user', () => {
    const { getAllByTestId } = renderWithRouter(
      <ActionButtonUsers
        usersItem={licensesPrepaidExpandedMock[0]}
        licenceDetail={licensesPrepaidExpandedMock[0]}
      />,
    );

    const menuItems = getAllByTestId('manager-button-without-tooltip');

    expect(menuItems.length).toBe(1);

    expect(menuItems[0]).toHaveTextContent(actions.edit_account);
  });
});

describe('Users datagrid (licence) action menu W3C Validation', () => {
  /*
    issue with ods popover
    error: The “aria-controls” attribute must point to an element in the same document.
   */
  it.skip('should have a valid html', async () => {
    const { container } = renderWithRouter(
      <ActionButtonUsers usersItem={usersMock[0]} licenceDetail={licensesMock[0]} />,
    );
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});
