import React from 'react';

import { renderWithShell } from '../../../__tests__';

import UserSupportLevel from '../UserSupportLevel';

describe('UserSupportLevel', () => {
  it('displays informations', async () => {
    const user = {
      supportLevel: 'standard',
    };
    const universe = 'web';

    const environment = {
      getUser: () => user,
      getUniverse: () => universe,
      getUserLocale: () => 'fr_FR',
      getRegion: () => 'EU',
    };

    const { queryByText } = await renderWithShell(
      <UserSupportLevel user={user} />,
      { environment },
    );

    expect(queryByText(/user_infos_support_level_standard/i)).toBeTruthy();
  });
});
