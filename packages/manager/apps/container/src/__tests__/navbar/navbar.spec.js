import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { act, waitFor } from '@testing-library/react';
import { renderWithNotifications } from '../__test-utils__/contextRenders';

import Navbar from '@/container/legacy/navbar/Navbar';

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
  rest.get(
    '/engine/apiv6/me/preferences/manager/NAV_RESHUFFLE_BETA_ACCESS',
    (req, res) => {
      return res(false);
    },
  ),
  rest.get(
    '/engine/2api/feature/pnr:betaV1,pnr:betaV2/availability',
    (req, res, ctx) => {
      return res(ctx.json({}));
    },
  ),
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

    let render = null;

    await act(async () => {
      render = await renderWithNotifications(
        <Navbar environment={environment}></Navbar>,
        environment,
      );
    });

    await waitFor(() => {
      expect(render.asFragment()).toMatchSnapshot();
    });
  });
});
