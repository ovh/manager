import { LegacyContainerProvider } from '@ovh-ux/manager-container-app/src/container/legacy/context';
import React from 'react';
import { act } from '@testing-library/react';
import { Environment, User } from '@ovh-ux/manager-config';
import AvailableCredit from '@/components/AvailableCredit';
import { renderWithShell } from '@/__tests__/__test-utils__/contextRenders';

describe('UI Testing AvailableCredit component', () => {
  it('render completly with shell', async () => {
    const user: Partial<User> = {
      firstname: 'Tester',
      name: 'testee',
      supportLevel: {
        level: '1',
      },
      country: 'FR',
    };
    const universe = 'web';

    const environment: Partial<Environment> = {
      getUser: () => user as User,
      getUniverse: () => universe,
      getUserLocale: () => 'fr_FR',
    };
    let render;

    await act(async () => {
      render = await renderWithShell(
        <LegacyContainerProvider>
          <AvailableCredit></AvailableCredit>
        </LegacyContainerProvider>,
        { environment },
      );
    });
    expect(render.asFragment()).toMatchSnapshot();
  });
});
