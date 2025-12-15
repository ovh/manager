import { describe, expect } from 'vitest';

import actions from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import { licensesMock, licensesPrepaidExpandedMock } from '@/data/api/__mocks__/license';
import { usersMock } from '@/data/api/__mocks__/user';
import { renderWithRouter } from '@/utils/Test.provider';

import ActionButtonUsers from '../ActionButtonUsers.component';

describe('Users datagrid (licence) action menu', () => {
  // You should update according to new DOM
  /*
@ovh-ux/manager-web-office-app:test:  FAIL  src/pages/dashboard/users/__tests__/ActionButtonUsers.component.spec.tsx > Users datagrid (licence) action menu > we have good number of item with good content for office native user
@ovh-ux/manager-web-office-app:test: AssertionError: expected +0 to be 3 // Object.is equality
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: - Expected
@ovh-ux/manager-web-office-app:test: + Received
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: - 3
@ovh-ux/manager-web-office-app:test: + 0
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test:  ❯ src/pages/dashboard/users/__tests__/ActionButtonUsers.component.spec.tsx:19:30
@ovh-ux/manager-web-office-app:test:      17|     const menuItems = container.querySelectorAll('ods-popover ods-button');
@ovh-ux/manager-web-office-app:test:      18|
@ovh-ux/manager-web-office-app:test:      19|     expect(menuItems.length).toBe(3);
@ovh-ux/manager-web-office-app:test:        |                              ^
@ovh-ux/manager-web-office-app:test:      20|
@ovh-ux/manager-web-office-app:test:      21|     expect(menuItems[0]).toHaveAttribute('label', actions.edit_account);
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test:  FAIL  src/pages/dashboard/users/__tests__/ActionButtonUsers.component.spec.tsx > Users datagrid (licence) action menu > we have good number of item with good content for officePrepaid configured user
@ovh-ux/manager-web-office-app:test: AssertionError: expected +0 to be 3 // Object.is equality
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: - Expected
@ovh-ux/manager-web-office-app:test: + Received
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: - 3
@ovh-ux/manager-web-office-app:test: + 0
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test:  ❯ src/pages/dashboard/users/__tests__/ActionButtonUsers.component.spec.tsx:36:30
@ovh-ux/manager-web-office-app:test:      34|     const menuItems = container.querySelectorAll('ods-popover ods-button');
@ovh-ux/manager-web-office-app:test:      35|
@ovh-ux/manager-web-office-app:test:      36|     expect(menuItems.length).toBe(3);
@ovh-ux/manager-web-office-app:test:        |                              ^
@ovh-ux/manager-web-office-app:test:      37|
@ovh-ux/manager-web-office-app:test:      38|     expect(menuItems[0]).toHaveAttribute('label', actions.edit_account);
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test:  FAIL  src/pages/dashboard/users/__tests__/ActionButtonUsers.component.spec.tsx > Users datagrid (licence) action menu > we have good number of item with good content for officePrepaid unconfigured user
@ovh-ux/manager-web-office-app:test: AssertionError: expected +0 to be 1 // Object.is equality
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: - Expected
@ovh-ux/manager-web-office-app:test: + Received
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: - 1
@ovh-ux/manager-web-office-app:test: + 0
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test:  ❯ src/pages/dashboard/users/__tests__/ActionButtonUsers.component.spec.tsx:54:30
@ovh-ux/manager-web-office-app:test:      52|     const menuItems = container.querySelectorAll('ods-popover ods-button');
@ovh-ux/manager-web-office-app:test:      53|
@ovh-ux/manager-web-office-app:test:      54|     expect(menuItems.length).toBe(1);
@ovh-ux/manager-web-office-app:test:        |                              ^
@ovh-ux/manager-web-office-app:test:      55|
@ovh-ux/manager-web-office-app:test:      56|     expect(menuItems[0]).toHaveAttribute('label', actions.edit_account);
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
   */
  it.skip('we have good number of item with good content for office native user', () => {
    const { container } = renderWithRouter(
      <ActionButtonUsers usersItem={usersMock[0]} licenceDetail={licensesMock[0]} />,
    );

    const menuItems = container.querySelectorAll('ods-popover ods-button');

    expect(menuItems.length).toBe(3);

    expect(menuItems[0]).toHaveAttribute('label', actions.edit_account);
    expect(menuItems[1]).toHaveAttribute('label', actions.change_password);
    expect(menuItems[2]).toHaveAttribute('label', actions.delete_account);
  });

  it.skip('we have good number of item with good content for officePrepaid configured user', () => {
    const { container } = renderWithRouter(
      <ActionButtonUsers
        usersItem={licensesPrepaidExpandedMock[1]}
        licenceDetail={licensesPrepaidExpandedMock[1]}
      />,
    );

    const menuItems = container.querySelectorAll('ods-popover ods-button');

    expect(menuItems.length).toBe(3);

    expect(menuItems[0]).toHaveAttribute('label', actions.edit_account);
    expect(menuItems[1]).toHaveAttribute('label', actions.change_password);

    expect(menuItems[2]).toHaveAttribute('label', actions.delete_account);
  });

  it.skip('we have good number of item with good content for officePrepaid unconfigured user', () => {
    const { container } = renderWithRouter(
      <ActionButtonUsers
        usersItem={licensesPrepaidExpandedMock[0]}
        licenceDetail={licensesPrepaidExpandedMock[0]}
      />,
    );

    const menuItems = container.querySelectorAll('ods-popover ods-button');

    expect(menuItems.length).toBe(1);

    expect(menuItems[0]).toHaveAttribute('label', actions.edit_account);
  });
});

describe('Users datagrid (licence) action menu W3C Validation', () => {
  /*
  L  src/pages/dashboard/users/__tests__/ActionButtonUsers.component.spec.tsx > Users datagrid (licence) action menu W3C Validation > should have a valid html
@ovh-ux/manager-web-office-app:test: Error: expected HTML to be valid, but got:
@ovh-ux/manager-web-office-app:test: :1.92-1.453: error: The “aria-controls” attribute must point to an element in the same document.
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test:  ❯ src/pages/dashboard/users/__tests__/ActionButtonUsers.component.spec.tsx:126:5
@ovh-ux/manager-web-office-app:test:     124|     const html = container.innerHTML;
@ovh-ux/manager-web-office-app:test:     125|
@ovh-ux/manager-web-office-app:test:     126|     await expect(html).toBeValidHtml();
@ovh-ux/manager-web-office-app:test:        |     ^
@ovh-ux/manager-web-office-app:test:     127|   });
@ovh-ux/manager-web-office-app:test:     128| });
   */
  it.skip('should have a valid html', async () => {
    const { container } = renderWithRouter(
      <ActionButtonUsers usersItem={usersMock[0]} licenceDetail={licensesMock[0]} />,
    );
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});
