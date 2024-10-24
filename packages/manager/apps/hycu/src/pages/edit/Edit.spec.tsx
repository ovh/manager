import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import '@testing-library/jest-dom';
import { labels } from '@/utils/tests/init.i18n';
import { catalog } from '@/mocks/catalogHycu/catalogHycu.data';

describe('License Hycu edit test suite', () => {
  it('should display the hycu edit page', async () => {
    await renderTestApp('/fake-id/edit');

    await waitFor(() => screen.getByText(labels.edit.hycu_edit_title), {
      timeout: 10_000,
    });

    expect(screen.getByText(labels.edit.hycu_edit_title)).toBeVisible();
    expect(screen.getByText(labels.edit.hycu_edit_description)).toBeVisible();
    expect(screen.getByText(labels.edit.hycu_edit_subtitle)).toBeVisible();

    expect(
      screen.queryByText(labels.edit.hycu_edit_initiated_title),
    ).not.toBeInTheDocument();
  });

  it('should enable order button when different pack is selected', async () => {
    await renderTestApp('/fake-id/edit');

    await waitFor(() => screen.getByText(catalog.plans[0].invoiceName), {
      timeout: 10_000,
    });

    expect(screen.getByText(labels.edit.hycu_edit_cta_order)).toBeDisabled();

    await act(() =>
      userEvent.click(screen.getByText(catalog.plans[1].invoiceName)),
    );

    expect(screen.getByText(labels.edit.hycu_edit_cta_order)).toBeEnabled();
  });

  it('should redirect to express order and change page informations', async () => {
    const closeSpy = vi.fn();
    window.open = vi.fn().mockReturnValue({ close: closeSpy });

    await renderTestApp('/fake-id/edit');

    await waitFor(() => screen.getByText(catalog.plans[1].invoiceName), {
      timeout: 10_000,
    });

    // Pack selection
    await act(() =>
      userEvent.click(screen.getByText(catalog.plans[1].invoiceName)),
    );

    // Click on order button
    await act(() =>
      userEvent.click(screen.getByText(labels.edit.hycu_edit_cta_order)),
    );

    expect(window.open).toHaveBeenCalled();

    // Check page has changed to display express order info
    expect(
      screen.getByText(labels.edit.hycu_edit_initiated_title),
    ).toBeVisible();

    expect(
      screen.queryByText(labels.edit.hycu_edit_subtitle),
    ).not.toBeInTheDocument();
  });
});
