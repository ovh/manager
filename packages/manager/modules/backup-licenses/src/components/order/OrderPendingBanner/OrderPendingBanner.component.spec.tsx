import React from 'react';

import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PENDING_ORDER_TIMEOUT_MS } from '@/module.constants';
import { labels } from '@/test-utils/i18ntest.utils';
import { renderWithProviders } from '@/test-utils/renderWithProviders';

import OrderPendingBanner, {
  ORDER_PENDING_ERROR_TEST_ID,
  ORDER_PENDING_PROGRESS_TEST_ID,
  ORDER_PENDING_TIMEOUT_TEST_ID,
} from './OrderPendingBanner.component';

const renderBanner = (props: Partial<React.ComponentProps<typeof OrderPendingBanner>> = {}) =>
  renderWithProviders(
    <OrderPendingBanner
      submittedAt={Date.now()}
      orderId={12345}
      hasDeliveryFailed={false}
      onRestart={vi.fn()}
      {...props}
    />,
  );

describe('OrderPendingBanner', () => {
  it('says the order is being delivered and how long it may take', async () => {
    await renderBanner();

    expect(screen.getByText(labels.order.pending.title)).toBeInTheDocument();
    expect(screen.getAllByText(labels.order.pending.description).length).toBeGreaterThan(0);
    expect(screen.getByTestId(ORDER_PENDING_PROGRESS_TEST_ID)).toBeInTheDocument();
  });

  it('names the order number when the checkout returned one', async () => {
    await renderBanner();

    expect(screen.getByText(/12345/)).toBeInTheDocument();
  });

  it('stays silent about a delay while the delivery is still young', async () => {
    await renderBanner();

    expect(screen.queryByTestId(ORDER_PENDING_TIMEOUT_TEST_ID)).not.toBeInTheDocument();
  });

  it('warns when the delivery drags on, without pretending it stopped', async () => {
    await renderBanner({ submittedAt: Date.now() - PENDING_ORDER_TIMEOUT_MS - 1 });

    expect(await screen.findByTestId(ORDER_PENDING_TIMEOUT_TEST_ID)).toBeInTheDocument();
    expect(screen.getByTestId(ORDER_PENDING_PROGRESS_TEST_ID)).toBeInTheDocument();
  });

  it('replaces the progress with the failure and a way out when the delivery failed', async () => {
    const onRestart = vi.fn();
    const { container } = await renderBanner({ hasDeliveryFailed: true, onRestart });

    expect(screen.getByTestId(ORDER_PENDING_ERROR_TEST_ID)).toBeInTheDocument();
    expect(screen.queryByTestId(ORDER_PENDING_PROGRESS_TEST_ID)).not.toBeInTheDocument();

    fireEvent.click(
      container.querySelector(`ods-button[label="${labels.order.pending.restart}"]`) as Element,
    );
    expect(onRestart).toHaveBeenCalled();
  });
});
