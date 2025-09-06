import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { SetupServer, setupServer } from 'msw/node';

import { toMswHandlers } from '@ovh-ux/manager-core-test-utils';

import {
  featureAvailabilityError,
  getFeatureAvailabilityMocks,
} from './mocks/feature-availability.mock';
import { useFeatureAvailability } from './useFeatureAvailability';

let server: SetupServer | null;

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

const Example = () => {
  const { data, isError, error, isSuccess } = useFeatureAvailability(['feature1', 'feature2']);
  return (
    <>
      {isError && <div>{error.response?.data.message}</div>}
      {isSuccess && data.feature1 && <div>feature1 available</div>}
      {isSuccess && data.feature2 && <div>feature2 available</div>}
    </>
  );
};

const setupTest = (useCase: 'error' | 'ok') => {
  server = setupServer(
    ...toMswHandlers(
      getFeatureAvailabilityMocks({
        isFeatureAvailabilityServiceKo: useCase === 'error',
        featureAvailabilityResponse: {
          feature1: true,
          feature2: false,
        },
      }),
    ),
  );
  server.listen({ onUnhandledRequest: 'warn' });
  return render(
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>,
  );
};

describe('useFeatureAvailability', () => {
  afterEach(() => {
    server?.close();
    server = null;
  });

  it('displays an error if the service is KO', async () => {
    setupTest('error');
    await waitFor(() => expect(screen.getByText(featureAvailabilityError)).toBeVisible(), {
      timeout: 10000,
    });
  });

  it('display only the features that are available', async () => {
    setupTest('ok');
    await waitFor(() => expect(screen.getByText('feature1 available')).toBeVisible(), {
      timeout: 10000,
    });
    expect(screen.queryByText('feature2 available')).not.toBeInTheDocument();
  });
});
