import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../config/i18nTestConfig';
import Shell from '../../shell';
import ApplicationContext from '../../context';

// TODO: improve mocks to render shell with both sidebars
const server = setupServer(
  rest.get('/engine/2api/notification', (req, res, ctx) => {
    return res(ctx.json([]));
  }),
  rest.get('/engine/2api/universes', (req, res, ctx) => {
    return res(ctx.json([]));
  }),
);

jest.mock('../../account-sidebar/AccountSidebar.jsx');
jest.mock('../../notifications-sidebar/NotificationsSidebar.jsx');

describe('Renders shell header', () => {
  // Given an environment with the user 'Tester testee'
  // When the Shell Header component is rendered
  // Then it must have the navbar rendered with env data
  let consoleErrorMock;
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => server.close());

  it('renders navbar with environment user', async () => {
    // IMPORTANT: Since the shell component calls the Router
    // which calls iframe.contentWindow.location methods
    // that are not implemented in jsdom ( => see jsdom caveats: https://github.com/jsdom/jsdom )
    // it prints an error that doesn't block the tests.
    // Since we don't care about this part in this test because
    // it doesn't change the way our component renders,
    // we mock the console.error method to have a clean console.
    // This doesn't prevent the test from failing
    // because a failing test doesn't call console.error.
    // Removing this line will just result on an error on the console
    // but the test will still pass or fail.
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();

    // Arrange
    const user = {
      firstname: 'Tester',
      name: 'testee',
      supportLevel: 1,
    };
    const universe = 'web';
    const ux = {
      registerSidebar: jest.fn(),
      isSidebarOpen: jest.fn(() => false),
      setNavbarNotificationCount: jest.fn(),
      getNavbarNotificationCount: jest.fn(() => 0),
      sidebars: {
        account: {
          isOpen: false,
        },
        notifications: {
          isOpen: false,
        },
      },
    };
    const environment = {
      getUser: () => user,
      getUniverse: () => universe,
      getUserLocale: () => 'fr_FR',
      getRegion: () => 'EU',
    };

    // Act
    render(
      <I18nextProvider i18n={i18n}>
        <ApplicationContext.Provider value={{ environment, ux }}>
          <Shell />
        </ApplicationContext.Provider>
      </I18nextProvider>,
    );

    // Assert
    // If the header contains the navbar
    // That means it contains the user fullname transformed
    // Since there is nothing else that show the name
    // There is no need for another assertion
    await waitFor(() => {
      screen.getByText('Tester Testee');
      // iframe has the role "document" and there is only one in the shell
      screen.getByRole('document');
    });

    // Restoring console.error to its original value for the other test cases
    consoleErrorMock.mockRestore();
  });
});
