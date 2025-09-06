import { screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { getOdsButtonByLabel } from '@ovh-ux/manager-core-test-utils';

import { logStreamsMock } from '../../data/mocks/logStream.mock';
import { renderTest } from '../../test-utils';

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@ovh-ux/manager-react-shell-client')>();
  return {
    ...mod,
    useNavigationGetUrl: () => ({
      getURL: vi.fn((app: string, path: string) => `#mockedurl-${app}${path}`),
    }),
  };
});

describe('dataStreams page test suite', () => {
  it('should display an error if /log/services api is KO', async () => {
    await renderTest({ initialRoute: '/streams', isLogServicesKO: true });

    await waitFor(() => expect(screen.getByTestId('logServices-error')).toBeVisible(), {
      timeout: 10_000,
    });
  });

  it('should display specific elements if there is no services', async () => {
    const { container } = await renderTest({
      initialRoute: '/streams',
      nbLogServices: 0,
    });

    await waitFor(
      () => expect(screen.queryByText('log_service_no_service_description')).toBeVisible(),
      {
        timeout: 10_000,
      },
    );
    await getOdsButtonByLabel({
      container,
      label: 'log_service_create',
    });
  });

  it('should render a loading state when the api request is pending', async () => {
    await renderTest({ initialRoute: '/streams' });

    await waitFor(() => expect(screen.getByTestId('logServices-spinner')).toBeVisible(), {
      timeout: 10_000,
    });
  });

  it('should render dataStreams page correctly', async () => {
    await renderTest({ initialRoute: '/streams' });

    await waitFor(() => expect(screen.queryByText('log_streams_title')).toBeInTheDocument(), {
      timeout: 10_000,
    });

    await waitFor(
      () => expect(screen.queryByText(logStreamsMock?.[0]?.title ?? '')).toBeInTheDocument(),
      {
        timeout: 10_000,
      },
    );
  });
});
