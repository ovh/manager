import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import '@testing-library/jest-dom';
import { labels } from '@/utils/tests/init.i18n';
import { okmsMock } from '@/mocks/kms/okms.mock';

describe('KMS dashboard test suite', () => {
  it('should display an error if the API is KO', async () => {
    await renderTestApp(`/${okmsMock[0].id}`, {
      isOkmsKO: true,
    });

    await waitFor(
      () => expect(screen.getByAltText('OOPS')).toBeInTheDocument(),
      {
        timeout: 30_000,
      },
    );
  });

  it('should display the kms dashboard page', async () => {
    await renderTestApp(`/${okmsMock[0].id}`);

    await waitFor(
      () =>
        expect(
          screen.getAllByText(labels.dashboard.general_informations)[0],
        ).toBeVisible(),

      { timeout: 30_000 },
    );

    expect(screen.queryByAltText('OOPS')).not.toBeInTheDocument();
  });

  it(`should navigate back to the kms list on click on ${labels.dashboard.key_management_service_dashboard_back_link}`, async () => {
    await renderTestApp(`/${okmsMock[0].id}`);

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.dashboard.key_management_service_dashboard_back_link,
          ),
        ).toBeEnabled(),
      {
        timeout: 30_000,
      },
    );

    await act(() =>
      userEvent.click(
        screen.getByText(
          labels.dashboard.key_management_service_dashboard_back_link,
        ),
      ),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.listing.key_management_service_listing_title),
        ).toBeVisible(),
      { timeout: 30_000 },
    );
  });

  it(`should navigate to the service key page on click on ${labels.dashboard.encrypted_keys} `, async () => {
    await renderTestApp(`/${okmsMock[0].id}`);

    await waitFor(
      () =>
        expect(screen.getByText(labels.dashboard.encrypted_keys)).toBeEnabled(),
      {
        timeout: 30_000,
      },
    );

    await act(() =>
      userEvent.click(screen.getByText(labels.dashboard.encrypted_keys)),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.serviceKeys['key_management_service_service-keys_headline'],
          ),
        ).toBeVisible(),
      { timeout: 30_000 },
    );
  });

  it(`should navigate to the credential page on click on ${labels.dashboard.access_certificates} `, async () => {
    await renderTestApp(`/${okmsMock[0].id}`);

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.dashboard.access_certificates),
        ).toBeEnabled(),
      {
        timeout: 30_000,
      },
    );

    await act(() =>
      userEvent.click(screen.getByText(labels.dashboard.access_certificates)),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.credentials.key_management_service_credential_headline,
          ),
        ).toBeVisible(),
      {
        timeout: 30_000,
      },
    );
  });

  it('should navigate to the rename modal on click on rename button', async () => {
    await renderTestApp(`/${okmsMock[0].id}`);

    await waitFor(() => expect(screen.getByLabelText('edit')).toBeEnabled(), {
      timeout: 30_000,
    });

    await act(() => userEvent.click(screen.getByLabelText('edit')));

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.serviceKeys[
              'key_management_service_service-keys_dashboard_field_name'
            ],
          ),
        ).toBeVisible(),
      {
        timeout: 30_000,
      },
    );
  });
});
