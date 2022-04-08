import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { renderWithNotifications } from '../__test-utils__/contextRenders';

import Navbar from '../../navbar/navbar';

const server = setupServer(
  rest.get('/engine/2api/notification', (req, res, ctx) => {
    return res(ctx.json([]));
  }),
  rest.get('/engine/2api/universes', (req, res, ctx) => {
    return res(ctx.json(['hub', 'dedicated', 'web']));
  }),
  rest.get('/engine/2api/configuration', (req, res, ctx) => {
    return res(ctx.json([]));
  }),
);

describe('UI testing of the navbar', () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => server.close());

  it('renders correctly with environment and shell', async () => {
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

    // let fragment;
    // Act
    // const shell = await shellApi.initShell();

    // const { asFragment } = render(
    //   <I18nextProvider i18n={i18n}>
    //     <ApplicationProvider environment={environment} shell={shell}>
    //       <NotificationsProvider environment={environment}>
    //         <Navbar environment={environment}></Navbar>
    //       </NotificationsProvider>
    //     </ApplicationProvider>
    //   </I18nextProvider>,
    // );

    const { asFragment } = await renderWithNotifications(
      <Navbar environment={environment}></Navbar>,
      environment,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
