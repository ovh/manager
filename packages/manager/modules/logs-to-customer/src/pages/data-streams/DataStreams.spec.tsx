import { screen, waitFor } from '@testing-library/react';
import { logStreamsMock } from '../../data/mocks/logStream.mock';
import { renderTest } from '../../test-utils';

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
