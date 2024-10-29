import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import '@testing-library/jest-dom';
import { labels } from '@/utils/tests/init.i18n';
import { catalog } from '@/mocks/catalogHycu/catalogHycu.data';

describe('License Hycu order test suite', () => {
  it('should display the hycu order page', async () => {
    await renderTestApp('/order');

    await waitFor(() => screen.getByText(labels.order.hycu_order_title), {
      timeout: 10_000,
    });

    expect(screen.getByText(labels.order.hycu_order_title)).toBeVisible();
    expect(screen.getByText(labels.order.hycu_order_description)).toBeVisible();
    expect(screen.getByText(labels.order.hycu_order_subtitle)).toBeVisible();

    expect(
      screen.queryByText(labels.order.hycu_order_initiated_title),
    ).not.toBeInTheDocument();
  });

  it('should enable order button when pack is selected', async () => {
    await renderTestApp('/order');

    await waitFor(() => screen.getByText(catalog.plans[0].invoiceName), {
      timeout: 10_000,
    });

    expect(screen.getByText(labels.common.hycu_cta_order)).toBeDisabled();

    await act(() =>
      userEvent.click(screen.getByText(catalog.plans[0].invoiceName)),
    );

    expect(screen.getByText(labels.common.hycu_cta_order)).toBeEnabled();
  });

  it('should redirect to express order and change page informations', async () => {
    const closeSpy = vi.fn();
    window.open = vi.fn().mockReturnValue({ close: closeSpy });

    await renderTestApp('/order');

    await waitFor(() => screen.getByText(catalog.plans[0].invoiceName), {
      timeout: 10_000,
    });

    // Pack selection
    await act(() =>
      userEvent.click(screen.getByText(catalog.plans[0].invoiceName)),
    );

    // Click on order button
    await act(() =>
      userEvent.click(screen.getByText(labels.common.hycu_cta_order)),
    );

    expect(window.open).toHaveBeenCalled();

    // Check page has changed to display express order info
    expect(
      screen.getByText(labels.order.hycu_order_initiated_title),
    ).toBeVisible();

    expect(
      screen.queryByText(labels.order.hycu_order_subtitle),
    ).not.toBeInTheDocument();
  });
});
