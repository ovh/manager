import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderTest } from '../../test-utils';

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}));

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

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
