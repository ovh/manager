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
      country: 'FR',
    };
    const universe = 'web';

    const environment = {
      getUser: () => user,
      getUniverse: () => universe,
      getUserLocale: () => 'fr_FR',
      getRegion: () => 'EU',
    };

    const { asFragment } = await renderWithNotifications(
      <Navbar environment={environment}></Navbar>,
      environment,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
