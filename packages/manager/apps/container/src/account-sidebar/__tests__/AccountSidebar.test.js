import React from 'react';

import AccountSidebar from '../AccountSidebar';
import { renderWithShell } from '../../__tests__';

jest.mock('../PaymentMethod/usePaymentMethod', () => {
  const usePaymentMethod = () => {
    return {
      isEnterpriseAccount: () => true,
      getDefaultPaymentMethod: () => {},
    };
  };
  return usePaymentMethod;
});

describe('UI testing of AccountSidebar', () => {
  it('renders correctly', async () => {
    const user = {
      firstname: 'Tester',
      name: 'testee',
      supportLevel: 'standard',
    };
    const universe = 'web';

    const environment = {
      getUser: () => user,
      getUniverse: () => universe,
      getUserLocale: () => 'fr_FR',
      getRegion: () => 'EU',
    };

    const { asFragment } = await renderWithShell(<AccountSidebar />, {
      environment,
    });

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('AccountSidebar', () => {
  it('displays informations', async () => {
    const user = {
      firstname: 'Tester',
      name: 'testee',
      supportLevel: 'standard',
    };
    const universe = 'web';

    const environment = {
      getUser: () => user,
      getUniverse: () => universe,
      getUserLocale: () => 'fr_FR',
      getRegion: () => 'EU',
    };

    const { getByRole, queryByText } = await renderWithShell(
      <AccountSidebar />,
      { environment },
    );

    expect(queryByText(/TT/i)).toBeTruthy();
    expect(queryByText(/Tester testee/i)).toBeTruthy();

    expect(
      getByRole('link', { name: /user_infos_manage_my_account/i }),
    ).toBeTruthy();
    expect(
      getByRole('button', { name: /user_infos_footer_logout/i }),
    ).toBeTruthy();
  });
});
