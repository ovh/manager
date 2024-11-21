import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import '@testing-library/jest-dom';
import { labels } from '@/utils/tests/init.i18n';
import { catalog } from '@/mocks/catalogHycu/catalogHycu.data';
import { licensesHycu } from '@/mocks/licenseHycu/licenseHycu.data';

describe('License Hycu edit test suite', () => {
  it('should display the hycu edit page', async () => {
    await renderTestApp(`/${licensesHycu[0].serviceName}/edit-pack`);

    await waitFor(
      () => screen.getByText(labels.editPack.hycu_edit_pack_title),
      {
        timeout: 10_000,
      },
    );

    expect(
      screen.getByText(labels.editPack.hycu_edit_pack_title),
    ).toBeVisible();
    expect(
      screen.getByText(labels.editPack.hycu_edit_pack_description),
    ).toBeVisible();
    expect(
      screen.getByText(
        labels.editPack.hycu_edit_pack_subtitle.replace(
          '{{displayName}}',
          'N/A',
        ),
      ),
    ).toBeVisible();

    expect(
      screen.queryByText(labels.editPack.hycu_edit_pack_initiated_title),
    ).not.toBeInTheDocument();
  });

  it('should enable order button when different pack is selected', async () => {
    await renderTestApp(`/${licensesHycu[0].serviceName}/edit-pack`);

    await waitFor(() => screen.getByText(catalog.plans[0].invoiceName), {
      timeout: 10_000,
    });

    expect(screen.getByText(labels.common.hycu_cta_order)).toBeDisabled();

    await act(() =>
      userEvent.click(screen.getByText(catalog.plans[1].invoiceName)),
    );

    expect(screen.getByText(labels.common.hycu_cta_order)).toBeEnabled();
  });

  it('should redirect to express order and change page informations', async () => {
    const closeSpy = vi.fn();
    window.open = vi.fn().mockReturnValue({ close: closeSpy });

    await renderTestApp(`/${licensesHycu[0].serviceName}/edit-pack`);

    await waitFor(() => screen.getByText(catalog.plans[1].invoiceName), {
      timeout: 10_000,
    });

    // Pack selection
    await act(() =>
      userEvent.click(screen.getByText(catalog.plans[1].invoiceName)),
    );

    // Click on order button
    await act(() =>
      userEvent.click(screen.getByText(labels.common.hycu_cta_order)),
    );

    expect(window.open).toHaveBeenCalled();

    // Check page has changed to display express order info
    expect(
      screen.getByText(labels.editPack.hycu_edit_pack_initiated_title),
    ).toBeVisible();

    expect(
      screen.queryByText(labels.editPack.hycu_edit_pack_subtitle),
    ).not.toBeInTheDocument();
  });
});
