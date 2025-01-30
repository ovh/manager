import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { logStreamsMock } from '../../data/mocks/logStream.mock';
import { renderTest } from '../../test-utils';

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const mod = await importOriginal<
    typeof import('@ovh-ux/manager-react-shell-client')
  >();
  const navigateTo = vi.fn();
  return {
    ...mod,
    ShellContext: React.createContext({
      shell: {
        navigation: {
          getURL: vi.fn().mockResolvedValue('mocked-url'),
        },
      },
    }),
    useNavigation: () => ({
      navigateTo,
    }),
  };
});

describe('dataStreams page test suite', () => {
  it('should display an error if /log/services api is KO', async () => {
    await renderTest({ initialRoute: '/streams', isLogServicesKO: true });

    await waitFor(
      () => expect(screen.getByTestId('logServices-error')).toBeVisible(),
      {
        timeout: 10_000,
      },
    );
  });

  it('should render a loading state when the api request is pending', async () => {
    await renderTest({ initialRoute: '/streams' });

    await waitFor(
      () => expect(screen.getByTestId('logServices-spinner')).toBeVisible(),
      {
        timeout: 10_000,
      },
    );
  });

  it('should render correctly dataStreams page correctly', async () => {
    await renderTest({ initialRoute: '/streams' });

    await waitFor(
      () => expect(screen.queryByText('log_streams_title')).toBeInTheDocument(),
      {
        timeout: 10_000,
      },
    );

    await waitFor(
      () =>
        expect(screen.queryByText(logStreamsMock[0].title)).toBeInTheDocument(),
      {
        timeout: 10_000,
      },
    );
  });
});
