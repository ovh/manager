import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  WAIT_FOR_DEFAULT_OPTIONS,
  assertOdsModalVisibility,
  assertTextVisibility,
  getOdsButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';

import { KMS_FEATURES } from '@/common/utils/feature-availability/feature-availability.constants';
import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { SERVICE_KEYS_LABEL } from '@/constants';

const mockedOkms = okmsRoubaix1Mock;
const mockPageUrl = KMS_ROUTES_URLS.kmsDashboard(mockedOkms.id);

const generalInformationTabTestId = KMS_ROUTES_URLS.kmsDashboard(mockedOkms.id);
const serviceKeyListTabTestId = KMS_ROUTES_URLS.serviceKeyListing(mockedOkms.id);
const credentialListTabTestId = KMS_ROUTES_URLS.credentialListing(mockedOkms.id);
const logTabTestId = KMS_ROUTES_URLS.kmsLogs(mockedOkms.id);

describe('KMS dashboard test suite', () => {
  it('should display an error if the API is KO', async () => {
    await renderTestApp(mockPageUrl, {
      isOkmsKO: true,
    });

    await waitFor(
      () => expect(screen.getByAltText('OOPS')).toBeInTheDocument(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it('should display the kms dashboard page', async () => {
    await renderTestApp(mockPageUrl, {
      feature: KMS_FEATURES.LOGS,
    });

    await waitFor(
      () => {
        expect(screen.getByTestId(generalInformationTabTestId)).toBeVisible();
        expect(screen.getByTestId(serviceKeyListTabTestId)).toBeVisible();
        expect(screen.getByTestId(credentialListTabTestId)).toBeVisible();
        expect(screen.getByTestId(logTabTestId)).toBeVisible();
      },

      WAIT_FOR_DEFAULT_OPTIONS,
    );

    expect(screen.queryByAltText('OOPS')).not.toBeInTheDocument();
  });

  it(`should navigate back to the kms list on click on ${labels.dashboard.key_management_service_dashboard_back_link}`, async () => {
    const { container } = await renderTestApp(mockPageUrl);

    const backLink = await getOdsButtonByLabel({
      container,
      label: labels.dashboard.key_management_service_dashboard_back_link,
      isLink: true,
      timeout: 3000,
    });

    await waitFor(() => userEvent.click(backLink));

    await assertTextVisibility(labels.listing.key_management_service_listing_title);
  });

  it(`should navigate to the service key page on click on ${SERVICE_KEYS_LABEL} `, async () => {
    await renderTestApp(mockPageUrl);

    await waitFor(
      () => expect(screen.getByTestId(serviceKeyListTabTestId)).toBeEnabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    await waitFor(() =>
      userEvent.click(screen.getByTestId(KMS_ROUTES_URLS.serviceKeyListing(mockedOkms.id))),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.serviceKeys['key_management_service_service-keys_headline']),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it(`should navigate to the credential page on click on ${labels.dashboard.access_certificates} `, async () => {
    await renderTestApp(mockPageUrl);

    await waitFor(
      () => expect(screen.getByTestId(credentialListTabTestId)).toBeEnabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    await waitFor(() => userEvent.click(screen.getByText(labels.dashboard.access_certificates)));

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.credentials.key_management_service_credential_headline),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it('should navigate to the rename modal on click on rename button', async () => {
    const { container } = await renderTestApp(mockPageUrl);

    await waitFor(
      () => expect(screen.getByLabelText('edit')).toBeEnabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    await waitFor(() => userEvent.click(screen.getByLabelText('edit')));

    // Wait for modal to open
    await assertOdsModalVisibility({ container, isVisible: true });

    expect(await screen.findByText(labels.common.actions.modify_name)).toBeVisible();
  });
});
