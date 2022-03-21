import React from 'react';

import { renderWithShell } from '../../../__tests__';

import UserInfos from '../UserInfos';

describe('UI testing of UserInfos', () => {
  it('renders correctly', async () => {
    const user = {
      firstname: 'Tester',
      name: 'testee',
      supportLevel: 1,
    };
    const universe = 'web';

    const environment = {
      getUser: () => user,
      getUniverse: () => universe,
      getUserLocale: () => 'fr_FR',
      getRegion: () => 'EU',
    };

    const { asFragment } = await renderWithShell(<UserInfos />, {
      environment,
    });

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('UserInfos', () => {
  it('displays informations', async () => {
    const user = {
      firstname: 'Guybrush',
      name: 'Threepwood',
      supportLevel: 'standard',
      organisation: 'OVH',
      email: 'guybrush.threepwood@email.com',
      nichandle: 'gt-nichandle',
      auth: { method: 'my-role' },
    };
    const universe = 'web';

    const environment = {
      getUser: () => user,
      getUniverse: () => universe,
      getUserLocale: () => 'fr_FR',
      getRegion: () => 'EU',
    };

    const { queryByText } = await renderWithShell(<UserInfos />, {
      environment,
    });

    expect(queryByText('user_infos_support_level_standard')).toBeTruthy(); // support level
    expect(queryByText('Guybrush Threepwood')).toBeTruthy(); // name
    expect(queryByText('GT')).toBeTruthy(); // initials
    expect(queryByText('OVH')).toBeTruthy(); // organisation
    expect(queryByText('guybrush.threepwood@email.com')).toBeTruthy(); // email
    expect(queryByText('gt-nichandle')).toBeTruthy(); // nichandle
  });
});
