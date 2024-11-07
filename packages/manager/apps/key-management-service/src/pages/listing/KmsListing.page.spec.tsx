import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import '@testing-library/jest-dom';
import { labels } from '@/utils/tests/init.i18n';
import { okmsMock } from '@/mocks/kms/okms.mock';

describe('KMS listing test suite', () => {
  it('should redirect to the onboarding page when the kms list is empty', async () => {
    await renderTestApp('/', { nbOkms: 0 });

    expect(screen.getByText(labels.onboarding.title)).toBeVisible();

    expect(
      screen.queryByText(labels.listing.key_management_service_listing_title),
    ).not.toBeInTheDocument();
  });

  it('should display the kms listing page', async () => {
    await renderTestApp();

    expect(
      screen.getByText(labels.listing.key_management_service_listing_title),
    ).toBeVisible();

    expect(
      screen.queryByText(labels.onboarding.description),
    ).not.toBeInTheDocument();
  });

  it(`should navigate to the kms creation form on click on "${labels.listing.key_management_service_listing_add_kms_button}" button`, async () => {
    await renderTestApp();

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.listing.key_management_service_listing_add_kms_button,
          ),
        ).toBeEnabled(),
      {
        timeout: 30_000,
      },
    );

    await act(() =>
      userEvent.click(
        screen.getByText(
          labels.listing.key_management_service_listing_add_kms_button,
        ),
      ),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.create.key_management_service_create_subtitle,
          ),
        ).toBeVisible(),
      { timeout: 30_000 },
    );
  });

  it('should navigate to a kms dashboard on click on kms name', async () => {
    await renderTestApp();

    await act(() =>
      userEvent.click(screen.getByText(okmsMock[0].iam.displayName)),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.dashboard.billing_informations),
        ).toBeVisible(),
      { timeout: 30_000 },
    );
  });

  it(`should navigate to the kms delete modal on click on "${labels.listing.key_management_service_listing_terminate}" list action button`, async () => {
    await renderTestApp();

    await act(() =>
      userEvent.click(
        screen.getByText(
          labels.listing.key_management_service_listing_terminate,
        ),
      ),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.terminate.key_management_service_terminate_cancel,
          ),
        ).toBeVisible(),
      { timeout: 30_000 },
    );
  });
});
