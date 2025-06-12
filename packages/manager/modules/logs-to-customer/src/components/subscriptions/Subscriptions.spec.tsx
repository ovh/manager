import { screen, waitFor } from '@testing-library/react';
import { getOdsButtonByLabel } from '@ovh-ux/manager-core-test-utils';
import { describe, expect, it, vi } from 'vitest';
import { renderTest } from '../../test-utils';

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}));

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const mod = await importOriginal<
    typeof import('@ovh-ux/manager-react-shell-client')
  >();
  return {
    ...mod,
    useNavigationGetUrl: () => ({
      getURL: vi.fn((app: string, path: string) => `#mockedurl-${app}${path}`),
    }),
  };
});

describe('Subscription list', () => {
  it('should display an error if /log/subscription api is KO', async () => {
    await renderTest({ isLogSubscriptionKO: true });

    await waitFor(
      () => expect(screen.getByTestId('logSubscriptions-error')).toBeVisible(),
      {
        timeout: 10_000,
      },
    );
  });

  it('should display specific elements if there is no services', async () => {
    const { container } = await renderTest({ nbLogServices: 0 });

    await waitFor(
      () =>
        expect(
          screen.queryByText('log_service_no_service_description'),
        ).toBeVisible(),
      {
        timeout: 10_000,
      },
    );
    await getOdsButtonByLabel({
      container,
      label: 'log_service_create',
    });
  });

  it('should render an empty state when there is no subscriptions', async () => {
    await renderTest({ nbLogSubscription: 0 });

    await waitFor(
      () =>
        expect(
          screen.getByText('log_subscription_empty_tile_description'),
        ).toBeDefined(),
      {
        timeout: 10_000,
      },
    );
  });

  it('should render two subscriptions tile', async () => {
    await renderTest({ nbLogSubscription: 2 });

    await waitFor(
      () =>
        expect(screen.getAllByText('log_subscription_tile_title')).toHaveLength(
          2,
        ),
      {
        timeout: 10_000,
      },
    );
  });
});
